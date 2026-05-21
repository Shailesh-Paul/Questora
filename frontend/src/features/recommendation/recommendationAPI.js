import axios from "axios";
import { API_BASE_URL } from "../../config";

export const fetchRecommendations = async (destination, role = 'user') => {
  const res = await axios.get(`${API_BASE_URL}/recommendations/${destination}?role=${role}`);
  return res.data;
};
