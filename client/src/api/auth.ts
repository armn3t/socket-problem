
import { API_BASE_URL } from './url';

import axios from 'axios';

export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
