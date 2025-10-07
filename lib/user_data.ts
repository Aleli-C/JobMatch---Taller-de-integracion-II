// lib/user_data.ts
'use server';

import { prisma } from '@/lib/prisma';           // tu singleton de Prisma
import { getSession } from '@/lib/session';
import type { TipoUsuario } from '@prisma/client';

export type User = {
  id: number;
  rut: string;
  nombre: string;
  correo: string;
  region: string;
  ciudad: string;
  direccion: string;
  tipoUsuario: TipoUsuario;
  comuna: string | null; // <- agregado
};

export async function getCurrentUser(): Promise<User> {
  const s = await getSession();
  if (!s?.sub) throw new Error('not authenticated');
  const id = Number(s.sub);
  if (Number.isNaN(id)) throw new Error('invalid id');

  const u = await prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true, rut: true, nombre: true, correo: true,
      region: true, ciudad: true, direccion: true, tipoUsuario: true,
      // requiere relación Usuario -> Ubicacion (ubicacionId)
      ubicacion: { select: { comuna: true } },
    },
  });
  if (!u) throw new Error('user not found');

  return {
    id: u.id, rut: u.rut, nombre: u.nombre, correo: u.correo,
    region: u.region, ciudad: u.ciudad, direccion: u.direccion, tipoUsuario: u.tipoUsuario,
    comuna: u.ubicacion?.comuna ?? null,
  };
}
