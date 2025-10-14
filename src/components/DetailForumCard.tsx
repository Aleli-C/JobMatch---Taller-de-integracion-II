"use client";
import type { ForumDetail } from "@/types/forum";

function fmt(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function DetailForumCard({ post }: { post: ForumDetail }) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">{post.titulo}</h2>
      <p className="text-gray-600 mt-1 text-sm">
        Por {post.nombres} {post.apellidos} · {post.rol} · {fmt(post.fecha)}
      </p>
      <p className="mt-3 text-gray-800 whitespace-pre-wrap">{post.consulta}</p>
      <p className="mt-3 text-sm text-gray-500">
        💬 {post.total_respuestas} respuestas
      </p>
    </article>
  );
}
