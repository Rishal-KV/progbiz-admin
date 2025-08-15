// axiosConfig.js
import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin`// change to your backend URL
 
});

// =============================
// Request Interceptor
// =============================
api.interceptors.request.use(
  (config) => {
    // Example: Attach JWT token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Optional: Log the request

    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// =============================
// Response Interceptor
// =============================
api.interceptors.response.use(
  (response) => {
    // Optional: Log the response
    console.log(`[Response]`, response.data);

    return response;
  },
  (error) => {
    // Check if the response exists
    if (error.response) {
      console.error(`[Response Error] ${error.response.status}`, error.response.data);

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        // Example: clear token & redirect
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else if (error.request) {
      // No response from server
      console.error("[Network Error] No response received", error.request);
    } else {
      console.error("[Axios Error]", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
