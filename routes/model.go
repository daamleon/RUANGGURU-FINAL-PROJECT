package routes

import (
	"encoding/json"
	"net/http"
)

func SetModelHandler(selectedModel *string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload struct {
			Model string `json:"model"`
		}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil || payload.Model == "" {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		*selectedModel = payload.Model
		response := map[string]string{
			"status": "success",
			"model":  *selectedModel,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func GetModelHandler(selectedModel *string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		response := map[string]string{
			"status": "success",
			"model":  *selectedModel,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
