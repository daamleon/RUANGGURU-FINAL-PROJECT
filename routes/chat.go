package routes

import (
	"encoding/json"
	"net/http"

	"a21hc3NpZ25tZW50/service"
)

func ChatHandler(aiService *service.AIService, token string, selectedModel *string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Query string `json:"query"`
		}
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil || request.Query == "" {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		chatResponse, err := aiService.ChatWithAI("", request.Query, token, *selectedModel)
		if err != nil {
			http.Error(w, "Failed to process chat query", http.StatusInternalServerError)
			return
		}

		response := map[string]string{
			"status": "success",
			"answer": chatResponse.GeneratedText,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
