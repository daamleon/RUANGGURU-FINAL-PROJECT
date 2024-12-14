import React, { useState } from "react";
import Header from "./components/header";
import UploadFile from "./components/uploadFile";
import ChatInput from "./components/chatInput";
import ResponseArea from "./components/responseArea";
import ChooseModel from "./components/chooseModel";
import Footer from "./components/footer";
import useFetchSelectedModel from "./hooks/useFetchSelectedModel";
import RealtimeData from "./components/realtimeData"; // Mengganti RealtimeComponent menjadi RealtimeData
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [fileQuery, setFileQuery] = useState("");
  const [generalQuery, setGeneralQuery] = useState("");
  const [responseWords, setResponseWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("google/gemma-2-2b-it");
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [setData] = useState({
    Humidity: 0,
    RandomHumidity: 0,
    Temperature: 0,
    RandomTemperature: 0,
  });

  // Fungsi untuk menerima data dari RealtimeData
  const handleRealtimeData = (newData) => {
    setData(newData);
  };

  useFetchSelectedModel(setSelectedModel);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

  const handleUpload = async () => {
    if (!file || !fileQuery) {
      alert("Please select a file and enter a query for the file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("query", fileQuery);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      displayResponseWords(res.data.answer);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

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
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = async (model) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/set-model", {
        model,
      });

      if (res.data && res.data.status === "success") {
        setSelectedModel(model);
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
      <Header
        showModelSelection={showModelSelection}
        setShowModelSelection={setShowModelSelection}
      />

      {showModelSelection ? (
        <ChooseModel
          setSelectedModel={(model) => handleModelChange(model)}
          selectedModel={selectedModel}
          setShowModelSelection={setShowModelSelection}
        />
      ) : (
        <>
          <div className="flex-grow overflow-y-auto">
            <div>
              <RealtimeData
                onDataReceived={handleRealtimeData} // Mengirim data ke handleRealtimeData
              />
            </div>

            {/* File Upload Section */}
            <UploadFile
              handleFileChange={handleFileChange}
              handleUpload={handleUpload}
              fileQuery={fileQuery}
              setFileQuery={setFileQuery}
              loading={loading}
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
          />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
