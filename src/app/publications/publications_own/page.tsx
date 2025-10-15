// src/app/publications/publications_own/page.tsx
import PublicationCard from "@/components/PublicationCard";

type SP = Record<string, string | string[] | null>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams; // <- clave
  const normalized = Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, v ?? null])
  ) as SP;

  return <PublicationCard searchParams={normalized} scope="mine" />;
}
