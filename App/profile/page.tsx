'use client';

import UserProfileAside from '@/components/UserProfileAside';
import UserProfileTabs from '@/components/UserProfileTabs';

export default function ProfilePage() {
  return (
    <>
      <main className="flex gap-8 p-8 bg-gray-100">
        <UserProfileAside />
        <UserProfileTabs />
      </main>
    </>
  );
}