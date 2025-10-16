// lib/api.ts
import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001",
  withCredentials: true, // envía cookies
});
if (process.env.NEXT_PUBLIC_DEV_XUID === "1") {
  api.interceptors.request.use((cfg) => {
    const uid = localStorage.getItem("uid");
    if (uid) cfg.headers["x-user-id"] = uid; // solo DEV
    return cfg;
  });
}
export default api;
