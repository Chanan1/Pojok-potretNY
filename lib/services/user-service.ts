import { prisma } from "@/lib/db";
import type { UpdateUserInput } from "@/lib/validators/user";
import { getCreatorStats } from "./template-service";

// ─── GET USER BY USERNAME ───────────────────────────────
export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      templates: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { likes: true } },
        },
      },
    },
  });

  if (!user) return null;

  const stats = await getCreatorStats(user.id);

  return {
    ...user,
    templates: user.templates.map((t) => ({
      ...t,
      likes: t._count.likes,
    })),
    stats,
  };
}

// ─── GET USER BY ID ─────────────────────────────────────
export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

// ─── UPDATE USER PROFILE ────────────────────────────────
export async function updateUserProfile(id: string, data: UpdateUserInput) {
  // Check if username is being changed and if it's already taken
  if (data.username) {
    const existing = await prisma.user.findUnique({
      where: { username: data.username }
    });
    if (existing && existing.id !== id) {
      throw new Error("Username sudah digunakan oleh orang lain.");
    }
  }

  return prisma.user.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.username !== undefined ? { username: data.username } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.socials !== undefined ? { socials: JSON.stringify(data.socials) } : {}),
    },
  });
}

// ─── ENSURE USER EXISTS (for mock auth) ─────────────────
export async function ensureUser(id: string, username: string) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      id,
      name: "Demo User",
      username,
      email: `${username}@pojokpotret.id`,
      password: "demo",
      bio: "Pengguna Pojok•Potret",
      level: 1,
      socials: "{}",
    },
  });
}
