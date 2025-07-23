// lib/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh-token endpoint
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`,
          null,
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.token;
        // Save new token to localStorage
        localStorage.setItem("accessToken", newToken);

        // Update Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed: clear token and reject
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // force redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
