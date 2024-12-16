package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"a21hc3NpZ25tZW50/service"
)

// AnalyzeFirebaseHandler handles analyzing data from Firebase using AI
func AnalyzeFirebaseHandler(firebaseService *service.FirebaseService, aiService *service.AIService, token string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request at /analyze-firebase")

		// Parse request body
		var requestData struct {
			Path  string `json:"path"`  // Path to the Firebase node
			Query string `json:"query"` // Query for analysis
		}
		if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			log.Printf("Failed to parse request body: %v", err)
			return
		}
		log.Printf("Parsed request data: Path=%s, Query=%s", requestData.Path, requestData.Query)

		// Validate request data
		if requestData.Path == "" || requestData.Query == "" {
			http.Error(w, "Path and query are required fields", http.StatusBadRequest)
			log.Println("Validation failed: Path and Query are required fields")
			return
		}

		// Fetch data from Firebase
		data, err := firebaseService.GetData(requestData.Path)
		if err != nil {
			http.Error(w, "Failed to fetch data from Firebase", http.StatusInternalServerError)
			log.Printf("Error fetching Firebase data: %v", err)
			return
		}
		log.Printf("Fetched data from Firebase: %+v", data)

		// Convert data to TAPAS-compatible format (map[string][]string)
		tableData := map[string][]string{}
		for key, value := range data {
			log.Printf("Key: %s, Value: %v, Type: %T", key, value, value)
			switch v := value.(type) {
			case string:
				tableData[key] = []string{v}
			case float64:
				tableData[key] = []string{fmt.Sprintf("%v", v)}
			default:
				log.Printf("Skipping key %s: unsupported value type %T", key, value)
			}
		}
		log.Printf("Converted data to table format: %+v", tableData)

		// Analyze data with AI
		log.Println("Starting AnalyzeData")
		log.Printf("Received table: %+v", tableData)
		log.Printf("Received query: %s", requestData.Query)

		result, err := aiService.AnalyzeData(tableData, requestData.Query, token)
		if err != nil {
			http.Error(w, "Failed to analyze data", http.StatusInternalServerError)
			log.Printf("Failed to analyze data: %v", err)
			return
		}

		// Return analysis result
		response := map[string]interface{}{
			"status": "success",
			"answer": result,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		log.Println("Response sent successfully")
	}
}
