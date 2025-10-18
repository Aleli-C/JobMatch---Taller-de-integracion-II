import axios from "axios";
import type { ForumDetail } from "@/types/forum";

// Usa el .env existente: NEXT_PUBLIC_API_BASE=http://localhost:3001
const API = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

export async function fetchForums(params?: { q?: string }) {
  if (!API) throw new Error("Falta NEXT_PUBLIC_API_BASE");

  const { data } = await axios.get<ForumDetail[]>(`${API}/forums`, {
    params: { q: params?.q || undefined },
    withCredentials: true,
  });

  // Asegura opcionales
  return (Array.isArray(data) ? data : []).map((x) => ({
    ...x,
    autor: x.autor ?? undefined,
    total_respuestas: typeof x.total_respuestas === "number" ? x.total_respuestas : undefined,
  }));
}

export async function fetchForumById(id_foro: number) {
  if (!API) throw new Error("Falta NEXT_PUBLIC_API_BASE");

  const { data } = await axios.get<ForumDetail>(`${API}/forums/${id_foro}`, {
    withCredentials: true,
  });

  return {
    ...data,
    autor: data?.autor ?? undefined,
    total_respuestas: typeof data?.total_respuestas === "number" ? data.total_respuestas : undefined,
  } as ForumDetail;
}
