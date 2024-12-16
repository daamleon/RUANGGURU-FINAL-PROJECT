import React from "react";

const ChooseModel = ({
  setSelectedModel,
  selectedModel,
  setShowModelSelection,
}) => {
  const models = [
    { id: "google/gemma-2-2b-it", name: "Google Gemma" },
    { id: "microsoft/Phi-3.5-mini-instruct", name: "Microsoft Phi 3.5" },
    { id: "Qwen/QwQ-32B-Preview", name: "Qwen Preview" },
    { id: "Qwen/Qwen2.5-Coder-32B-Instruct", name: "Qwen Instruct" },
    // { id: "microsoft/DialoGPT-medium", name: "Microsoft DialoGPT" },
    // { id: "facebook/blenderbot-400M-distill", name: "Facebook BlenderBot" },
  ];

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId); // Pilih model
    setShowModelSelection(false); // Kembali ke halaman chat
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Choose AI Model</h1>
      <ul className="space-y-4">
        {models.map((model) => (
          <li
            key={model.id}
            className={`p-4 w-full max-w-md text-center rounded-lg cursor-pointer ${
              selectedModel === model.id
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => handleModelSelect(model.id)} // Pilih model dan kembali ke chat
          >
            {model.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChooseModel;
