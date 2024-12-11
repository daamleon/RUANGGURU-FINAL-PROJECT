import { useEffect } from "react";
import axios from "axios";

const useFetchSelectedModel = (setSelectedModel) => {
  useEffect(() => {
    const fetchSelectedModel = async () => {
      try {
        const res = await axios.get("http://localhost:8080/get-model");
        if (res.data && res.data.model) {
          setSelectedModel(res.data.model);
        }
      } catch (error) {
        console.error("Error fetching model from backend:", error);
      }
    };

    fetchSelectedModel();
  }, [setSelectedModel]);
};

export default useFetchSelectedModel;
