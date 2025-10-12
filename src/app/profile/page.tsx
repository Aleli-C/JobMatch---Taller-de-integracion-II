// app/perfil/page.tsx
import OwnProfile from '@/components/OwnProfile';
import { UserProvider } from '@/components/UserProvider';
import { getCurrentUser } from '@/lib/user_data';

export default async function Page() {
  const user = await getCurrentUser();
  return (
    <UserProvider initialUser={user}>
      <OwnProfile />
    </UserProvider>
  );
}
