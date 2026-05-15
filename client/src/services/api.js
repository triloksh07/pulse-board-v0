import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export function apiError(error) {
  return (
    error?.response?.data?.message || error.message || "Something went wrong"
  );
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.setState({ user: null, ready: true });
    }
    return Promise.reject(error);
  }
);
