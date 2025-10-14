import axios from "axios";
import type { ForumDetail } from "@/types/forum";

// Usa .env: NEXT_PUBLIC_API_BASE_URL 
const API = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

export async function fetchForums(params?: {
  q?: string;
  tipo?: string;
  ciudad?: string;
  region?: string;
  estado?: string;
}) {
  const search = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v) search.set(k, v);
  });
  const url = `${API}/forums${search.toString() ? `?${search}` : ""}`;
  const { data } = await axios.get<ForumDetail[]>(url, { withCredentials: true });
  return data;
}

export async function fetchForumById(id: number) {
  const url = `${API}/forums/${id}`;
  const { data } = await axios.get<ForumDetail>(url, { withCredentials: true });
  return data;
}
