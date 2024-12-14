package routes

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"a21hc3NpZ25tZW50/service"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func FirebaseRealtimeHandler(firebaseService *service.FirebaseService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Upgrade HTTP connection to WebSocket
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("WebSocket upgrade error:", err)
			return
		}
		defer conn.Close()

		// Goroutine untuk mengirim pesan ping secara berkala
		go func() {
			ticker := time.NewTicker(30 * time.Second)
			defer ticker.Stop()

			for {
				<-ticker.C
				if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
					log.Println("Error sending ping:", err)
					break
				}
			}
		}()

		// Loop utama untuk mengirim data realtime
		for {
			data, err := firebaseService.GetData("/DHT22")
			if err != nil {
				log.Println("Error fetching data:", err)
				time.Sleep(1 * time.Second)
				continue
			}

			// Kirim data ke WebSocket client
			if err := conn.WriteJSON(data); err != nil {
				log.Println("Error sending data:", err)
				break
			}
			time.Sleep(500 * time.Millisecond)
		}
	}
}
