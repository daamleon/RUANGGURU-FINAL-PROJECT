package service

import (
	"context"
	"log"
	"os"
	"firebase.google.com/go"
	"firebase.google.com/go/db"
	"google.golang.org/api/option"
)

// FirebaseService is used to interact with Firebase Realtime Database
type FirebaseService struct {
	client *db.Client
}

// InitializeFirebase initializes the Firebase client
func InitializeFirebase() (*FirebaseService, error) {
	opt := option.WithCredentialsFile("C:/Grader/FCP-AI/final-project-golang-ai-v5/privatekey/adamesp32v2-firebase-adminsdk-sodms-e530c0e4c4.json")
app, err := firebase.NewApp(context.Background(), nil, opt)
if err != nil {
    log.Fatalf("error initializing app: %v", err)
    return nil, err
}

// Ambil host dari environment variable
firebaseHost := os.Getenv("FIREBASE_HOST")
if firebaseHost == "" {
    log.Fatal("FIREBASE_HOST is not set in the .env file")
}

// Gunakan Firebase host untuk inisialisasi database
client, err := app.DatabaseWithURL(context.Background(), firebaseHost)
if err != nil {
    log.Fatalf("error getting Database client: %v", err)
    return nil, err
}

	return &FirebaseService{client: client}, nil
}

// GetData retrieves data from Firebase Realtime Database
func (f *FirebaseService) GetData(path string) (map[string]interface{}, error) {
	ref := f.client.NewRef(path)
	var result map[string]interface{}
	if err := ref.Get(context.Background(), &result); err != nil {
		log.Printf("error getting data from Firebase: %v", err)
		return nil, err
	}
	return result, nil
}
