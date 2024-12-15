import React, { useState } from "react";
import Header from "./components/header";
// import MobileNavbar from "./components/mobileNavbar";
import UploadFile from "./components/uploadFile";
import ChatInput from "./components/chatInput";
import ResponseArea from "./components/responseArea";
import ChooseModel from "./components/chooseModel";
import Footer from "./components/footer";
import useFetchSelectedModel from "./hooks/useFetchSelectedModel";
import RealtimeData from "./components/realtimeData";
import axios from "axios";

function App() {
  const [showFileInput, setShowFileInput] = useState(false);
  const [file, setFile] = useState(null);
  const [fileQuery, setFileQuery] = useState("");
  const [generalQuery, setGeneralQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("google/gemma-2-2b-it");
  const [responseWords, setResponseWords] = useState([]);
  const [showModelSelection, setShowModelSelection] = useState(false);
  const toggleFileInput = () => {
    if (showFileInput) {
      setFile(null); // Reset file saat input file disembunyikan
    }
    setShowFileInput((prev) => !prev);
  };

  const [setData] = useState({
    Humidity: 0,
    RandomHumidity: 0,
    Temperature: 0,
    RandomTemperature: 0,
  });

  // Fetch default model from backend or preset
  useFetchSelectedModel(setSelectedModel);

  // Mengatur data dari RealtimeData
  const handleRealtimeData = (newData) => {
    setData(newData);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const displayResponseWords = (response) => {
    const words = response.split(" ");
    setResponseWords([]);
    words.forEach((word, index) => {
      setTimeout(() => {
        setResponseWords((prevWords) => [...prevWords, word]);
      }, index * 100);
    });
  };

  // Mengirim file dan menganalisis query
  const handleAnalyze = async () => {
    try {
      if (!file && !fileQuery) {
        alert("Please upload a file or enter a query for Firebase!");
        return;
      }

      setLoading(true);

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("query", fileQuery || "");

        const res = await axios.post("http://localhost:8080/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        displayResponseWords(res.data.answer);
      } else if (fileQuery) {
        const firebaseData = { path: "/DHT22", query: fileQuery };
        const res = await axios.post(
          "http://localhost:8080/analyze-firebase",
          firebaseData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        displayResponseWords(res.data.answer);
      }
    } catch (error) {
      console.error("Error analyzing file:", error);
      alert("Failed to analyze data. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  // Handle chat queries
  const handleChat = async () => {
    if (!generalQuery) {
      alert("Please enter a query for general chat!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/chat", {
        query: generalQuery,
      });
      displayResponseWords(res.data.answer);
    } catch (error) {
      console.error("Error querying chat:", error);
      alert("Error processing chat. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // Mengubah model yang dipilih
  const handleModelChange = async (model) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/set-model", {
        model,
      });

      if (res.data && res.data.status === "success") {
        setSelectedModel(model);
      } else {
        alert("Error setting model. Please try again.");
      }
    } catch (error) {
      console.error("Error updating model:", error);
      alert("Error updating model on backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 font-sans">
      {/* Header Section */}
      <Header
        showModelSelection={showModelSelection}
        setShowModelSelection={setShowModelSelection}
      />
      {/* <MobileNavbar /> */}
      {/* Model Selection Screen */}
      {showModelSelection ? (
        <ChooseModel
          setSelectedModel={(model) => handleModelChange(model)} // Callback untuk mengubah model
          selectedModel={selectedModel}
          setShowModelSelection={setShowModelSelection} // Menutup layar model
        />
      ) : (
        <>
          {/* Main Content */}
          <div className="flex-grow overflow-y-auto">
            {/* Real-time Data */}
            <RealtimeData
              onDataReceived={handleRealtimeData} // Data diterima dari komponen real-time
            />

            {/* File Upload Section */}
            <UploadFile
              handleFileChange={handleFileChange}
              handleAnalyze={handleAnalyze}
              fileQuery={fileQuery}
              setFileQuery={setFileQuery}
              loading={loading}
              showFileInput={showFileInput}
              toggleFileInput={toggleFileInput}
            />

            {/* Response Section */}
            <ResponseArea responseWords={responseWords} />
          </div>

          {/* Chat Input Section */}
          <ChatInput
            handleChat={handleChat}
            generalQuery={generalQuery}
            setGeneralQuery={setGeneralQuery}
            loading={loading}
            setShowModelSelection={setShowModelSelection} // Membuka layar model
            selectedModel={selectedModel} // Model yang dipilih dikirim ke ChatInput
          />

          {/* Footer */}
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
