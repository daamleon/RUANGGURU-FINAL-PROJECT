// BatteryBar.js
import React from "react";

const BatteryBar = ({ label, value, maxValue, color, format }) => {
  const percentage = Math.min((value / maxValue) * 100, 100); // Ensure max is 100%

  return (
    <div className="flex flex-col items-start w-full">
      <p className="text-sm md:text-lg font-medium mb-2">{label}</p>
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full ${color}`}
          style={{ width: `${percentage}%`, transition: "width 0.5s ease" }}
        ></div>
      </div>
      <p className="mt-2 text-sm font-bold">
        {value} / {maxValue} {format}
      </p>
    </div>
  );
};

export default BatteryBar;
