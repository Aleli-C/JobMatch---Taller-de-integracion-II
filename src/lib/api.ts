import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001",
  withCredentials: true, // enviar/recibir cookies
});
export default api;
