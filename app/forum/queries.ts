export type ThreadListItem = {
  id: string;
  title: string;
  createdAt: Date;
  tags: string[];
  categoryId: string | null;
  userId: string;
};

export async function getThreads(input: ForumThreadListInput = {}) {
  const { take, cursor, q, categoryId, tags, order } = forumThreadListSchema.parse(input);

  const where = {
    AND: [
      categoryId ? { categoryId } : {},
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { body: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      tags && tags.length
        ? { tags: { hasSome: tags } } // Postgres (String[])
        : {},
      // MySQL(JSON): usa { tags: { array_contains: tags } } si definiste JSON
    ],
  };

  const items = await prisma.thread.findMany({
    where,
    take: take + 1, // para calcular nextCursor
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ createdAt: order === "newest" ? "desc" : "asc" }, { id: "desc" }],
    select: { id: true, title: true, createdAt: true, tags: true, categoryId: true, userId: true },
  });

  const hasMore = items.length > take;
  const sliced = hasMore ? items.slice(0, take) : items;
  const nextCursor = hasMore ? sliced[sliced.length - 1]?.id : undefined;

  return { items: sliced as ThreadListItem[], nextCursor };
}

export async function getThreadById(id: string) {
  const thread = await prisma.thread.findUnique({
    where: { id },
    // agrega relaciones si existen (author, replies, etc.)
    select: {
      id: true,
      title: true,
      body: true,
      tags: true,
      categoryId: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!thread) throw new Error("Foro no encontrado");
  return thread;
}

// opcional: revalidar listados si cambias filtros/server state desde acciones
export async function revalidateForumList() {
  revalidatePath("/forum");
}