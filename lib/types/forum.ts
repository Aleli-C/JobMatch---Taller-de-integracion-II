// lib/types/forum.ts
export type Comment = { author: string; text: string; time: string };
export type Topic = {
  title: string;
  author: string;
  time: string;
  replies: number;
  content: string;
  comments: Comment[];
};
