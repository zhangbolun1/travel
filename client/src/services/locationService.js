import axios from 'axios';

const API_URL = 'http://localhost:5100/api/locations';

export const getLocations = async () => {
  try {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const addLocation = async (location) => {
  try {
    const response = await axios.post(API_URL, location, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
};

export const createLocation = addLocation;

export const updateLocation = async (id, location) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, location, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};

export const deleteLocation = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get('http://localhost:5100/api/history', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};