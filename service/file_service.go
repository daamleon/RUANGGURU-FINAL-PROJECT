package service

import (
	"encoding/csv"
	"fmt"
	"strings"

	repository "a21hc3NpZ25tZW50/repository/fileRepository"
)

type FileService struct {
	Repo *repository.FileRepository
}

// ProcessFile reads the file content, validates it, and converts it into a map[string][]string
func (s *FileService) ProcessFile(fileContent string) (map[string][]string, error) {
	// Validate file content (check if it's empty)
	if len(fileContent) == 0 {
		return nil, fmt.Errorf("file content is empty")
	}

	// Read and process the CSV file
	reader := csv.NewReader(strings.NewReader(fileContent))
	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to read CSV: %w", err)
	}

	// Ensure there is data in the CSV
	if len(records) < 1 {
		return nil, fmt.Errorf("empty CSV file")
	}

	// Process the CSV into a map
	result := make(map[string][]string)
	headers := records[0] // First row is the header

	for _, record := range records[1:] {
		for i, value := range record {
			result[headers[i]] = append(result[headers[i]], value)
		}
	}

	return result, nil
}


