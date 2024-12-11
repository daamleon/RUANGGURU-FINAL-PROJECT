package service

import (
	"a21hc3NpZ25tZW50/model"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"log"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type AIService struct {
	Client HTTPClient
}

// AnalyzeData communicates with the Tapas model to analyze the data table
func (s *AIService) AnalyzeData(table map[string][]string, query, token string) (string, error) {
    if len(table) == 0 || query == "" {
        return "", fmt.Errorf("table or query cannot be empty")
    }

    // url := "https://api-inference.huggingface.co/models/google/tapas-base-finetuned-wtq"
    url := "https://api-inference.huggingface.co/models/google/tapas-large-finetuned-wtq"
    
    // Convert table to array of objects
    var tableArray []map[string]string
    headers := make([]string, 0, len(table))
    for header := range table {
        headers = append(headers, header)
    }

    rowCount := len(table[headers[0]])
    for i := 0; i < rowCount; i++ {
        row := make(map[string]string)
        for _, header := range headers {
            row[header] = table[header][i]
        }
        tableArray = append(tableArray, row)
    }

    // Prepare payload
    payload := map[string]interface{}{
        "inputs": map[string]interface{}{
            "query": query,
            "table": tableArray,
        },
    }

    payloadBytes, err := json.Marshal(payload)
    if err != nil {
        return "", fmt.Errorf("failed to marshal payload: %w", err)
    }

    // Debug log for payload
    log.Printf("Payload sent to Hugging Face: %s", string(payloadBytes))

    req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
    if err != nil {
        return "", fmt.Errorf("failed to create request: %w", err)
    }
    req.Header.Set("Authorization", "Bearer "+token)
    req.Header.Set("Content-Type", "application/json")

    resp, err := s.Client.Do(req)
    if err != nil {
        return "", fmt.Errorf("failed to send request: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        body, _ := ioutil.ReadAll(resp.Body)
        log.Printf("Error response from Hugging Face: %s", string(body))
        return "", fmt.Errorf("received non-200 status code: %d", resp.StatusCode)
    }

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return "", fmt.Errorf("failed to read response body: %w", err)
    }

    var result model.TapasResponse
    if err := json.Unmarshal(body, &result); err != nil {
        return "", fmt.Errorf("failed to unmarshal response: %w", err)
    }

    if len(result.Cells) > 0 {
        return result.Cells[0], nil
    }

    return "", fmt.Errorf("no valid response from model")
}

// ChatWithAI communicates with a chat-based AI model
func (s *AIService) ChatWithAI(context, query, token, modelAi string) (model.ChatResponse, error) {
    if query == "" {
        return model.ChatResponse{}, fmt.Errorf("query cannot be empty")
    }

    // Gunakan model yang dipilih secara dinamis
    url := fmt.Sprintf("https://api-inference.huggingface.co/models/%s", modelAi)

    payload := map[string]interface{}{
        "inputs": query, // Kirim hanya query sebagai input
    }

    payloadBytes, err := json.Marshal(payload)
    if err != nil {
        return model.ChatResponse{}, fmt.Errorf("failed to marshal payload: %w", err)
    }

    req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
    if err != nil {
        return model.ChatResponse{}, fmt.Errorf("failed to create request: %w", err)
    }
    req.Header.Set("Authorization", "Bearer "+token)
    req.Header.Set("Content-Type", "application/json")

    resp, err := s.Client.Do(req)
    if err != nil {
        return model.ChatResponse{}, fmt.Errorf("failed to send request: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        body, _ := ioutil.ReadAll(resp.Body)
        log.Printf("Error response from Hugging Face: %s", string(body))
        return model.ChatResponse{}, fmt.Errorf("received non-200 status code: %d", resp.StatusCode)
    }

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return model.ChatResponse{}, fmt.Errorf("failed to read response body: %w", err)
    }

    // Coba parsing sebagai array JSON
    var resultArray []model.ChatResponse
    if err := json.Unmarshal(body, &resultArray); err == nil && len(resultArray) > 0 {
        return resultArray[0], nil // Ambil elemen pertama jika respons adalah array
    }

    // Jika gagal, coba parsing sebagai objek tunggal
    var result model.ChatResponse
    if err := json.Unmarshal(body, &result); err != nil {
        log.Printf("Error unmarshaling response: %v", err)
        return model.ChatResponse{}, fmt.Errorf("failed to unmarshal response: %w", err)
    }

    return result, nil
}




