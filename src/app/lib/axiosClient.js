import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Helper function to get token from cookie
export const getToken = () => {
  const token = Cookies.get("token"); // js-cookie reads browser cookie
  return token || null;
};

// Axios instance
const axiosClient = axios.create({
  baseURL: "/api", // sab API calls ke liye base
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    } else {
      // If token missing, redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;