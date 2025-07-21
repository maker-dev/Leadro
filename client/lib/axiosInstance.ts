import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Use env variable for flexibility
  withCredentials: true, // Send cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for auth, logging, etc.
// axiosInstance.interceptors.request.use(...)
// axiosInstance.interceptors.response.use(...)

export default axiosInstance;
