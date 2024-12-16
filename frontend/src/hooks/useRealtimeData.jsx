import { useState, useEffect } from "react";

const useRealtimeData = () => {
  const [data, setData] = useState({
    Humidity: 0,
    RandomHumidity: 0,
    Temperature: 0,
    RandomTemperature: 0,
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socket;
    let reconnectInterval;

    const connectWebSocket = () => {
      socket = new WebSocket("ws://localhost:8080/realtime-data");

      socket.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true);
        clearInterval(reconnectInterval);
      };

      socket.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data);
          setData({
            Humidity: receivedData.Humidity || 0,
            RandomHumidity: receivedData.RandomHumidity || 0,
            Temperature: receivedData.Temperature || 0,
            RandomTemperature: receivedData.RandomTemperature || 0,
          });
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };

      socket.onclose = () => {
        console.warn("WebSocket Disconnected");
        setIsConnected(false);
        reconnect(); // Start reconnect attempts
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        socket.close();
      };
    };

    const reconnect = () => {
      reconnectInterval = setInterval(() => {
        console.log("Attempting to reconnect WebSocket...");
        connectWebSocket();
      }, 5000); // Try to reconnect every 5 seconds
    };

    connectWebSocket(); // Initiate WebSocket connection

    return () => {
      if (socket) {
        socket.close();
      }
      clearInterval(reconnectInterval);
    };
  }, []);

  return { data, isConnected };
};

export default useRealtimeData;
