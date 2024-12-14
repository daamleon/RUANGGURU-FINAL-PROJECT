package routes

import (
	"encoding/json"
	"io"
	// "log"
	"net/http"

	"a21hc3NpZ25tZW50/service"
)

func UploadHandler(fileService *service.FileService, aiService *service.AIService, token string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		file, _, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "Failed to read uploaded file", http.StatusBadRequest)
			return
		}
		defer file.Close()

		query := r.FormValue("query")
		if query == "" {
			http.Error(w, "Query parameter is required", http.StatusBadRequest)
			return
		}

		fileContent, err := io.ReadAll(file)
		if err != nil {
			http.Error(w, "Failed to read file content", http.StatusInternalServerError)
			return
		}

		processedData, err := fileService.ProcessFile(string(fileContent))
		if err != nil {
			http.Error(w, "Failed to process file", http.StatusInternalServerError)
			return
		}

		analysisResult, err := aiService.AnalyzeData(processedData, query, token)
		if err != nil {
			http.Error(w, "Failed to analyze data", http.StatusInternalServerError)
			return
		}

		response := map[string]string{
			"status": "success",
			"answer": analysisResult,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
