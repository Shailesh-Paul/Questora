import axios from "axios";
import { API_BASE_URL } from "../../config";

export const fetchActivitiesByDestination = async (destination) => {
  const res = await axios.get(`${API_BASE_URL}/activities/${destination}`);
  return res.data;
};

export const fetchNearbyActivities = async (destination, lng, lat, maxDistance = 5000) => {
  const res = await axios.get(`${API_BASE_URL}/activities/nearby/${destination}?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`);
  return res.data;
};
