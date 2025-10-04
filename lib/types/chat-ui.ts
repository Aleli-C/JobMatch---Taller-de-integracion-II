// lib/types/chat-ui.ts
export type UIMessage = { text: string; senderId: string; time: string };
export type UIChatUser = { name: string; about: string; contact: string; avatar: string };
export type UIChat = { id: string; user: UIChatUser; messages: UIMessage[] };
