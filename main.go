package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"a21hc3NpZ25tZW50/service"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

// Initialize the services
var fileService = &service.FileService{}
var aiService = &service.AIService{Client: &http.Client{}}
var selectedModel = "google/gemma-2-2b-it" // Default model

func main() {
	// Load the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Retrieve the Hugging Face token from the environment variables
	token := os.Getenv("HUGGINGFACE_TOKEN")
	if token == "" {
		log.Fatal("HUGGINGFACE_TOKEN is not set in the .env file")
	}

	// Set up the router
	router := mux.NewRouter()

	// Define the /upload route
	router.HandleFunc("/upload", func(w http.ResponseWriter, r *http.Request) {
    log.Println("Received request at /upload") // Log awal saat request diterima

    // Parse file dari form-data
    file, fileHeader, err := r.FormFile("file")
    if err != nil {
        log.Printf("Error reading file: %v", err) // Log error jika gagal membaca file
        http.Error(w, "Failed to read uploaded file", http.StatusBadRequest)
        return
    }
    defer file.Close()

    log.Printf("Uploaded file: %s (size: %d bytes)", fileHeader.Filename, fileHeader.Size)

    // Baca isi file
    fileContent, err := io.ReadAll(file)
    if err != nil {
        log.Printf("Error reading file content: %v", err) // Log error jika gagal membaca isi file
        http.Error(w, "Failed to read file content", http.StatusInternalServerError)
        return
    }

    log.Println("File content read successfully")

    // Parse query dari form-data
    query := r.FormValue("query")
    if query == "" {
        log.Println("Query is empty") // Log jika query kosong
        http.Error(w, "Query parameter is required", http.StatusBadRequest)
        return
    }

    log.Printf("Received query: %s", query)

    // Proses file dengan FileService
    processedData, err := fileService.ProcessFile(string(fileContent))
    if err != nil {
        log.Printf("Error processing file: %v", err) // Log error jika gagal memproses file
        http.Error(w, "Failed to process file", http.StatusInternalServerError)
        return
    }

    log.Println("File processed successfully")

    // Kirim query dan data tabel ke AIService
    analysisResult, err := aiService.AnalyzeData(processedData, query, token)
    if err != nil {
        log.Printf("Error analyzing data: %v", err) // Log error jika AI gagal memproses query
        http.Error(w, "Failed to analyze data", http.StatusInternalServerError)
        return
    }

    log.Printf("Analysis result: %s", analysisResult)

    // Kirim respons ke client
    response := map[string]string{
        "status": "success",
        "answer": analysisResult,
    }
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(response); err != nil {
        log.Printf("Error encoding response: %v", err) // Log error jika encoding JSON gagal
        http.Error(w, "Failed to encode response", http.StatusInternalServerError)
        return
    }

    log.Println("Response sent successfully")
}).Methods("POST")

router.HandleFunc("/chat", func(w http.ResponseWriter, r *http.Request) {
	log.Println("Received chat request")

	var request struct {
		Query string `json:"query"`
	}

	// Decode request body
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Validasi query
	if request.Query == "" {
		log.Println("Query is empty")
		http.Error(w, "Query parameter is required", http.StatusBadRequest)
		return
	}

	log.Printf("Received query: %s", request.Query)
	log.Printf("Using selected model: %s", selectedModel) // Pastikan model yang digunakan sudah diperbarui

	// Gunakan model yang dipilih
	chatResponse, err := aiService.ChatWithAI("", request.Query, token, selectedModel)
	if err != nil {
		log.Printf("Error from AI service: %v", err)
		http.Error(w, "Failed to process chat query", http.StatusInternalServerError)
		return
	}

	log.Printf("Generated response: %s", chatResponse.GeneratedText)

	// Kirim respons ke client
	response := map[string]string{
		"status": "success",
		"answer": chatResponse.GeneratedText,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}).Methods("POST")

router.HandleFunc("/set-model", func(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to set model")

	var payload struct {
		Model string `json:"model"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Validasi model
	if payload.Model == "" {
		log.Println("Model name is empty")
		http.Error(w, "Model name is required", http.StatusBadRequest)
		return
	}

	// Update the selected model
	selectedModel = payload.Model
	log.Printf("Selected model updated to: %s", selectedModel)

	// Kirim respons ke client
	response := map[string]string{
		"status": "success",
		"model":  selectedModel,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}).Methods("POST")

router.HandleFunc("/get-model", func(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to get model")

	response := map[string]string{
		"status": "success",
		"model":  selectedModel,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}).Methods("GET")


	// Enable CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"}, // Allow your React app's origin
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	}).Handler(router)

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server running on port %s\n", port)

	log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}
