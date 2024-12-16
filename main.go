package main

import (
	"log"
	"net/http"
	"os"

	"a21hc3NpZ25tZW50/routes"
	"a21hc3NpZ25tZW50/service"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	token := os.Getenv("HUGGINGFACE_TOKEN")
	if token == "" {
		log.Fatal("HUGGINGFACE_TOKEN is not set in the .env file")
	}

	firebaseService, err := service.InitializeFirebase()
	if err != nil {
		log.Fatal("Failed to initialize Firebase service:", err)
	}

	var selectedModel = "google/gemma-2-2b-it"
	fileService := &service.FileService{}
	aiService := &service.AIService{Client: &http.Client{}}

	router := mux.NewRouter()

	// Register routes
	router.HandleFunc("/realtime-data", routes.FirebaseRealtimeHandler(firebaseService))
	router.HandleFunc("/analyze-firebase", routes.AnalyzeFirebaseHandler(firebaseService, aiService, token)).Methods("POST")
	router.HandleFunc("/upload", routes.UploadHandler(fileService, aiService, token)).Methods("POST")
	router.HandleFunc("/chat", routes.ChatHandler(aiService, token, &selectedModel)).Methods("POST")
	router.HandleFunc("/set-model", routes.SetModelHandler(&selectedModel)).Methods("POST")
	router.HandleFunc("/get-model", routes.GetModelHandler(&selectedModel)).Methods("GET")

	// Enable CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	}).Handler(router)

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}


