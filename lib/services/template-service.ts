import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { CreateTemplateInput, UpdateTemplateInput, TemplateQueryInput } from "@/lib/validators/template";

// ─── GET TEMPLATES (PAGINATED + FILTERED) ───────────────
export async function getTemplates(query: TemplateQueryInput) {
  const { category, frameCount, search, status, creatorId, page, limit, sort } = query;

  const where: Prisma.TemplateWhereInput = {
    ...(category && category !== "Semua" ? { category: { equals: category } } : {}),
    ...(frameCount ? { frameCount } : {}),
    ...(status ? { status } : { status: "PUBLISHED" }),
    ...(creatorId ? { creatorId } : {}),
    ...(search ? {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ],
    } : {}),
    isPublic: true,
  };

  const orderBy: Prisma.TemplateOrderByWithRelationInput =
    sort === "popular" ? { usageCount: "desc" } :
    sort === "likes" ? { downloadCount: "desc" } :
    { createdAt: "desc" };

  const skip = (page - 1) * limit;

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        creator: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        _count: { select: { likes: true } },
      },
    }),
    prisma.template.count({ where }),
  ]);

  return {
    data: templates.map((t) => ({
      ...t,
      likes: t._count.likes,
      creator: t.creator.name,
      creatorUsername: t.creator.username,
      creatorAvatar: t.creator.avatar,
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── GET SINGLE TEMPLATE ────────────────────────────────
export async function getTemplateById(id: string) {
  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, name: true, username: true, avatar: true, bio: true },
      },
      _count: { select: { likes: true } },
    },
  });

  if (!template) return null;

  return {
    ...template,
    likes: template._count.likes,
  };
}

// ─── CREATE TEMPLATE ────────────────────────────────────
export async function createTemplate(data: CreateTemplateInput, creatorId: string) {
  return prisma.template.create({
    data: {
      name: data.name,
      description: data.description,
      src: data.src,
      category: data.category,
      frameCount: data.frameCount,
      slots: JSON.stringify(data.slots || []),
      backgroundColor: data.backgroundColor,
      margin: data.margin,
      borderRadius: data.borderRadius,
      isPublic: data.isPublic,
      status: data.status,
      creatorId,
    },
    include: {
      creator: {
        select: { id: true, name: true, username: true },
      },
    },
  });
}

// ─── UPDATE TEMPLATE ────────────────────────────────────
export async function updateTemplate(id: string, data: UpdateTemplateInput) {
  return prisma.template.update({
    where: { id },
    data: {
      ...data,
      slots: data.slots ? JSON.stringify(data.slots) : undefined,
    },
    include: {
      creator: {
        select: { id: true, name: true, username: true },
      },
    },
  });
}

// ─── DELETE TEMPLATE ────────────────────────────────────
export async function deleteTemplate(id: string) {
  return prisma.template.delete({ where: { id } });
}

// ─── TOGGLE LIKE ────────────────────────────────────────
export async function toggleLike(userId: string, templateId: string) {
  const existing = await prisma.like.findUnique({
    where: { userId_templateId: { userId, templateId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.like.create({
    data: { userId, templateId },
  });
  return { liked: true };
}

// ─── INCREMENT USAGE ────────────────────────────────────
export async function incrementUsage(templateId: string) {
  return prisma.template.update({
    where: { id: templateId },
    data: { usageCount: { increment: 1 } },
  });
}

// ─── GET CREATOR STATS ──────────────────────────────────
export async function getCreatorStats(creatorId: string) {
  const [templates, totalLikes, aggregates] = await Promise.all([
    prisma.template.count({ where: { creatorId } }),
    prisma.like.count({ where: { template: { creatorId } } }),
    prisma.template.aggregate({
      where: { creatorId },
      _sum: { usageCount: true, downloadCount: true },
    }),
  ]);

  return {
    totalTemplates: templates,
    totalLikes,
    totalUses: aggregates._sum.usageCount ?? 0,
    totalDownloads: aggregates._sum.downloadCount ?? 0,
  };
}
