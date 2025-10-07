"use client";

import Link from "next/link";
import { Menu } from "@headlessui/react";
import { SlidersHorizontal, Plus } from "lucide-react";

type Filtro = "todo" | "buscar" | "ofrecer";

export default function OwnPublicationsToolbar({
  value,
  onChange,
}: {
  value: Filtro;
  onChange: (v: Filtro) => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Exclusivo de “Mis publicaciones” */}
      <div>
        <h1 className="text-2xl font-bold text-blue-600">Tus publicaciones</h1>
        <p className="text-gray-600 text-sm">
          Filtra por tipo: todas, buscar u ofrecer. También puedes crear una nueva publicación.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10">
            <div className="space-y-2">
              <label className="block text-xs text-gray-500">Tipo</label>
              <select
                value={value}
                onChange={(e) => onChange(e.target.value as Filtro)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="todo">Todas</option>
                <option value="buscar">Buscar</option>
                <option value="ofrecer">Ofrecer</option>
              </select>
            </div>
          </Menu.Items>
        </Menu>

        <Link
          href="/publications/publications_new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Crear publicación
        </Link>
      </div>
    </div>
  );
}
