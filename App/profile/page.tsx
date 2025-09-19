'use client';

import UserProfileAside from '@/components/components/UsuarioProfileAside';
import UserProfileTabs from '@/components/components/UsuarioProfileTabs';

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
