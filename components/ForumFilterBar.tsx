"use client";
import React, { FC, useRef } from "react";

interface Option { value: string; label: string }

export interface ForumFilterBarProps {
  authors: Option[];
  replies: Option[];
  onFilter?: (f: { search: string; author: string; replies: string }) => void;
  defaults?: { search?: string; author?: string; replies?: string };
}

const ForumFilterBar: FC<ForumFilterBarProps> = ({ authors, replies, onFilter, defaults }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(formRef.current!);
    onFilter?.({
      search: (data.get("search") as string) || "",
      author: (data.get("author") as string) || "",
      replies: (data.get("replies") as string) || "",
    });
  };

  const handleReset = () => {
    formRef.current?.reset();
    onFilter?.({ search: "", author: "", replies: "" });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Autor</label>
          <select name="author" defaultValue={defaults?.author ?? ""} className="w-full px-3 py-2 border rounded-md">
            {authors.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Respuestas</label>
          <select name="replies" defaultValue={defaults?.replies ?? ""} className="w-full px-3 py-2 border rounded-md">
            {replies.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Buscar</label>
          <input
            type="text"
            name="search"
            placeholder="Palabra clave en título o contenido..."
            defaultValue={defaults?.search ?? ""}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
          Filtrar
        </button>
        <button type="button" onClick={handleReset} className="text-blue-600 px-4 py-2 rounded-md text-sm border">
          Limpiar
        </button>
      </div>
    </form>
  );
};

export default ForumFilterBar;
