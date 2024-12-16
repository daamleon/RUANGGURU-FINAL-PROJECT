// RealtimeData.js
import React from "react";
import { FaTemperatureHigh, FaTint } from "react-icons/fa";
import useRealtimeData from "../hooks/useRealtimeData";
import BatteryBar from "./batteryBar"; // Impor komponen

const RealtimeData = () => {
  const { data, isConnected } = useRealtimeData();

  return (
    <div id="home" className="bg-gray-900 p-6 rounded-lg shadow-lg text-white ">
      <div className="flex flex-col sm:flex-row sm:gap-4 items-center justify-center mb-10 mt-2 md:mb-8 md:mt-0">
        <h2 className="text-xl sm:text-2xl font-bold text-teal-400">
          Realtime Monitoring
        </h2>
        <div className="text-center">
          <span>Status: </span>
          {isConnected ? (
            <span className="text-green-400 font-semibold">Connected ✅</span>
          ) : (
            <span className="text-red-500 font-semibold">Disconnected ❌</span>
          )}
        </div>
      </div>
      <div className="place-items-center">
        <div className="grid sm:w-[90%] md:w-[80%] lg:w-[60%] grid-cols-2 gap-6">
          {/* Temperature */}
          <div className="flex flex-col items-center bg-gray-500 p-4 rounded-lg shadow-md">
            <FaTemperatureHigh className="text-red-500 text-4xl mb-4" />
            <BatteryBar
              label="Temperature"
              value={data.Temperature}
              maxValue={100}
              format="°C"
              color="bg-red-500"
            />
          </div>

          {/* Humidity */}
          <div className="flex flex-col items-center bg-gray-500 p-4 rounded-lg shadow-md">
            <FaTint className="text-blue-500 text-4xl mb-4" />
            <BatteryBar
              label="Humidity"
              value={data.Humidity}
              maxValue={100}
              format="%"
              color="bg-blue-500"
            />
          </div>
          {/* Random Humidity */}
          <div className="flex flex-col items-center bg-gray-500 p-4 rounded-lg shadow-md">
            <FaTint className="text-blue-500 text-4xl mb-4" />
            <BatteryBar
              label="Random Humidity"
              value={data.RandomHumidity}
              maxValue={100}
              format="%"
              color="bg-blue-500"
            />
          </div>
          {/* Random Temperature */}
          <div className="flex flex-col items-center bg-gray-500 p-4 rounded-lg shadow-md">
            <FaTemperatureHigh className="text-orange-500 text-4xl mb-4" />
            <BatteryBar
              label="Random Temp"
              value={data.RandomTemperature}
              maxValue={100}
              format="°C"
              color="bg-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeData;
