import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/users/register`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/users/login`, userData);
};

export const getOrders = async () => {
  return await axios.get(`${API_URL}/orders`);
};

export const updateOrderStatus = async (orderId, status) => {
  return await axios.put(`${API_URL}/orders/${orderId}`, { status });
};