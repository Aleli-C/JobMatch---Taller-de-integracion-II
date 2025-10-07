// components/UserProvider.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/lib/user_data';

interface Ctx { user: User | null; loading: boolean; error: string | null; }
const UserContext = createContext<Ctx | undefined>(undefined);

export const useUser = () => {
  const v = useContext(UserContext);
  if (!v) throw new Error('useUser must be used within a UserProvider');
  return v;
};

export function UserProvider({ children, initialUser }: { children: ReactNode; initialUser: User }) {
  const [user] = useState<User | null>(initialUser);
  return <UserContext.Provider value={{ user, loading: false, error: null }}>{children}</UserContext.Provider>;
}
