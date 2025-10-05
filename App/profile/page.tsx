'use client';
import React from "react";
import OwnProfile from "@/components/OwnProfile";
import { UserProvider } from "@/components/UserProvider";
import { getSessionUser } from "@/lib/getSessionUser";
import { GetHistoryProfileUser } from "@/lib/history";

export default async function ProfilePage() {
  const session = await getSessionUser();
  const userId = session?.id ?? 0;

  const historyData =
    userId > 0
      ? await GetHistoryProfileUser(userId)
      : { forumHistory: [], publications: [] };

  return (
    <UserProvider>
      <main className="max-w-7xl mx-auto p-4 lg:p-8 bg-gray-100 min-h-screen">
        <OwnProfile historyData={historyData} />
      </main>
    </UserProvider>
  );
}
