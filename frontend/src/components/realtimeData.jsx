import React, { useEffect, useState } from "react";
import { FaTemperatureHigh, FaTint } from "react-icons/fa";

const RealtimeData = () => {
  const [data, setData] = useState({
    Humidity: 0,
    RandomHumidity: 0,
    Temperature: 0,
    RandomTemperature: 0,
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let socket; // Variabel untuk WebSocket
    let reconnectInterval; // Interval untuk mencoba reconnect

    const connectWebSocket = () => {
      socket = new WebSocket("ws://localhost:8080/realtime-data");

      socket.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true); // Menandakan bahwa koneksi WebSocket aktif
        clearInterval(reconnectInterval); // Hentikan usaha reconnect jika berhasil
      };

      socket.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data); // Parsing data JSON
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
        reconnect(); // Memulai usaha reconnect
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        socket.close(); // Menutup WebSocket jika ada error
      };
    };

    const reconnect = () => {
      reconnectInterval = setInterval(() => {
        console.log("Attempting to reconnect WebSocket...");
        connectWebSocket();
      }, 5000); // Mencoba reconnect setiap 5 detik
    };

    connectWebSocket(); // Sambungkan WebSocket saat komponen di-mount

    return () => {
      if (socket) {
        socket.close(); // Tutup koneksi WebSocket saat komponen di-unmount
      }
      clearInterval(reconnectInterval); // Bersihkan interval reconnect
    };
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-teal-400">
        Data Realtime IoT
      </h2>
      <div className="text-center mb-4">
        {isConnected ? (
          <span className="text-green-400 font-semibold">
            WebSocket Connected ✅
          </span>
        ) : (
          <span className="text-red-500 font-semibold">
            WebSocket Disconnected ❌
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Temperature */}
        <div className="flex items-center bg-gray-500 p-4 rounded-lg shadow-md">
          <FaTemperatureHigh className="text-red-500 text-4xl mr-4" />
          <div>
            <p className="text-lg font-medium">Temperature</p>
            <p className="text-2xl font-bold">{data.Temperature} °C</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center bg-gray-500 p-4 rounded-lg shadow-md">
          <FaTint className="text-blue-500 text-4xl mr-4" />
          <div>
            <p className="text-lg font-medium">Humidity</p>
            <p className="text-2xl font-bold">{data.Humidity} %</p>
          </div>
        </div>

        {/* Random Temperature */}
        <div className="flex items-center bg-gray-500 p-4 rounded-lg shadow-md">
          <FaTemperatureHigh className="text-orange-500 text-4xl mr-4" />
          <div>
            <p className="text-lg font-medium">Random Temperature</p>
            <p className="text-2xl font-bold">{data.RandomTemperature} °C</p>
          </div>
        </div>

        {/* Random Humidity */}
        <div className="flex items-center bg-gray-500 p-4 rounded-lg shadow-md">
          <FaTint className="text-green-500 text-4xl mr-4" />
          <div>
            <p className="text-lg font-medium">Random Humidity</p>
            <p className="text-2xl font-bold">{data.RandomHumidity} %</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeData;
