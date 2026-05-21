import axios from "axios";
import { API_BASE_URL } from "../../config";

export const getAIBundle = async (context) => {
  const res = await axios.post(`${API_BASE_URL}/ai/bundle`, context);
  return res.data;
};

export const getAIVehicleRecommendation = async (context) => {
  const res = await axios.post(`${API_BASE_URL}/ai/vehicle-recommendation`, context);
  return res.data;
};
