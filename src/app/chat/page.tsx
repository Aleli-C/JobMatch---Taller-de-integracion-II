"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { id: string; chatId: string; from: "me" | "them"; text: string; at: number };
type Chat = { id: string; title: string; partner: { id: string; name: string }; lastAt: number; unread: number };

const uid = (p = "") => p + Math.random().toString(36).slice(2, 10);

function seed(): { chats: Chat[]; messages: Msg[]; selectedId: string | null } {
  const now = Date.now();
  const c1: Chat = { id: uid("c_"), title: "María R.", partner: { id: "u1", name: "María Rodríguez" }, lastAt: now - 3600_000, unread: 0 };
  const c2: Chat = { id: uid("c_"), title: "Carlos P.", partner: { id: "u2", name: "Carlos Pérez" }, lastAt: now - 7200_000, unread: 2 };
  const c3: Chat = { id: uid("c_"), title: "Soporte", partner: { id: "u3", name: "Soporte JobMatch" }, lastAt: now - 86_400_000, unread: 0 };
  return {
    chats: [c1, c2, c3],
    messages: [
      { id: uid("m_"), chatId: c1.id, from: "them", text: "Hola 👋", at: now - 3600_000 },
      { id: uid("m_"), chatId: c1.id, from: "me", text: "¿Cómo vamos con la oferta?", at: now - 3590_000 },
      { id: uid("m_"), chatId: c2.id, from: "them", text: "¿Viste el contrato?", at: now - 7200_000 },
      { id: uid("m_"), chatId: c3.id, from: "them", text: "Bienvenido al soporte.", at: now - 86_300_000 },
    ],
    selectedId: c1.id,
  };
}

export default function Page() {
  const [{ chats, messages, selectedId }, setS] = useState(seed);
  const [q, setQ] = useState("");
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => chats.find(c => c.id === selectedId) ?? null, [chats, selectedId]);
  const msgs = useMemo(() => messages.filter(m => m.chatId === selectedId).sort((a, b) => a.at - b.at), [messages, selectedId]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const arr = s ? chats.filter(c => c.title.toLowerCase().includes(s) || c.partner.name.toLowerCase().includes(s)) : chats;
    return [...arr].sort((a, b) => b.lastAt - a.lastAt);
  }, [chats, q]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length, selectedId]);

  const selectChat = (id: string) =>
    setS(s => ({ ...s, selectedId: id, chats: s.chats.map(c => (c.id === id ? { ...c, unread: 0 } : c)) }));

  const send = () => {
    const t = text.trim();
    if (!t || !selected) return;
    const at = Date.now();
    const mine: Msg = { id: uid("m_"), chatId: selected.id, from: "me", text: t, at };
    setText("");
    setS(s => ({ ...s, messages: [...s.messages, mine], chats: s.chats.map(c => (c.id === selected.id ? { ...c, lastAt: at } : c)) }));
    // respuesta simulada
    setTimeout(() => {
      const reply: Msg = { id: uid("m_"), chatId: selected.id, from: "them", text: `Recibido: ${t}`, at: Date.now() };
      setS(s => ({ ...s, messages: [...s.messages, reply], chats: s.chats.map(c => (c.id === selected.id ? { ...c, lastAt: reply.at } : c)) }));
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-[22rem,1fr] gap-4 p-4">
      {/* Sidebar */}
      <aside className="rounded-2xl border border-gray-200 bg-white flex flex-col">
        <div className="p-3 border-b border-gray-200 flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar chats…"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Buscar chats"
          />
        </div>
        <div className="overflow-auto p-2 space-y-1" role="navigation" aria-label="Lista de chats">
          {filtered.map(c => {
            const active = c.id === selectedId;
            const last = messages.filter(m => m.chatId === c.id).slice(-1)[0]?.text ?? "Sin mensajes";
            return (
              <button
                key={c.id}
                onClick={() => selectChat(c.id)}
                className={`w-full text-left rounded-xl px-3 py-2 flex items-center gap-3 hover:bg-gray-50 ${
                  active ? "bg-blue-50 ring-1 ring-blue-200" : ""
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 grid place-items-center text-sm font-semibold">
                  {c.title.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{c.title}</span>
                    <span className="text-xs text-gray-500">{new Date(c.lastAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate">{last}</span>
                    {c.unread > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] px-2 h-5">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && <p className="p-4 text-sm text-gray-500">Sin resultados.</p>}
        </div>
      </aside>

      {/* Chat */}
      <section className="rounded-2xl border border-gray-200 bg-white flex flex-col">
        {/* Header con usuario */}
        <header className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 grid place-items-center text-sm font-semibold text-blue-800">
              {selected?.title.slice(0, 2).toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="font-semibold">{selected?.partner.name || "Selecciona un chat"}</h2>
              <p className="text-xs text-gray-500">{selected ? "En línea (simulado)" : "—"}</p>
            </div>
          </div>
        </header>

        {/* Mensajes */}
        <div
          ref={listRef}
          className="flex-1 overflow-auto p-4 space-y-3"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {selected ? (
            msgs.map(m => (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ring-1 ${
                  m.from === "me"
                    ? "ml-auto bg-blue-600 text-white ring-blue-500"
                    : "mr-auto bg-gray-50 text-gray-800 ring-gray-200"
                }`}
                title={new Date(m.at).toLocaleString()}
              >
                {m.text}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Elige un chat a la izquierda.</p>
          )}
        </div>

        {/* Input */}
        <form
          className="p-3 border-t border-gray-200 flex items-end gap-3"
          onSubmit={e => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            disabled={!selected}
            rows={1}
            placeholder={selected ? `Mensaje para ${selected.partner.name}` : "Selecciona un chat"}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            aria-label="Escribir mensaje"
          />
          <button
            type="submit"
            disabled={!selected || !text.trim()}
            className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
      </section>
    </div>
  );
}
