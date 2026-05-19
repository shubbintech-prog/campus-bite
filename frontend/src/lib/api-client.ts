import axios from "axios";

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return "http://localhost:5000/api";
  }
  // Ensure URL has a protocol (default to https:// if missing, unless localhost)
  let formattedUrl = envUrl;
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }
  // Append /api if it's missing (as apiClient requests don't prefix /api themselves)
  if (!formattedUrl.endsWith("/api") && !formattedUrl.endsWith("/api/")) {
    formattedUrl = formattedUrl.endsWith("/") 
      ? `${formattedUrl}api` 
      : `${formattedUrl}/api`;
  }
  return formattedUrl;
};

const API_URL = getApiUrl();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("auth-storage");
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (e) {
        console.error("Error parsing auth-storage", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
