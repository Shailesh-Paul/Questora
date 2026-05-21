import axios from "axios";
import { API_BASE_URL } from "../../config";

export const fetchDailyBudget = async (destination) => {
  const res = await axios.get(`${API_BASE_URL}/budget/${destination}`);
  return res.data;
};
