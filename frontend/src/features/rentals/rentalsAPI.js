import axios from "axios";
import { API_BASE_URL } from "../../config";

export const fetchVehicles = async (params = {}) => {
  const res = await axios.get(`${API_BASE_URL}/vehicles`, { params });
  return res.data;
};

export const fetchRentalsByDestination = async (destination, hours = null) => {
  const url = hours 
    ? `${API_BASE_URL}/rentals/${destination}?hours=${hours}`
    : `${API_BASE_URL}/rentals/${destination}`;
  const res = await axios.get(url);
  return res.data;
};

export const createVehicle = async (vehicleData, token) => {
  const res = await axios.post(`${API_BASE_URL}/vehicles`, vehicleData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateVehicleStatus = async (vehicleId, status, token) => {
  const res = await axios.patch(`${API_BASE_URL}/vehicles/status/${vehicleId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
