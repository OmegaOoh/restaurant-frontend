import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:8443", // Spring Boot HTTPS
  withCredentials: true, // Send HttpOnly cookies
});

export default api;
