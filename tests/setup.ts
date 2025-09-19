import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  // Aseguramos una DB limpia antes de cada suite de tests
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);
  const tables = await prisma.$queryRaw<
    { name: string }[]
  >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`;
  for (const { name } of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${name};`);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
