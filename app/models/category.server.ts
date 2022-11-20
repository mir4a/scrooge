import type { User, Category } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Category } from "@prisma/client";

export function getCategory({
  id,
  userId,
}: Pick<Category, "id"> & {
  userId: User["id"];
}) {
  return prisma.category.findFirst({
    select: { id: true, name: true, color: true },
    where: { id, userId },
  });
}

export function getCategories({ userId }: { userId: User["id"] }) {
  return prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createCategory({
  name,
  color,
  userId,
}: Pick<Category, "name" | "color"> & {
  userId: User["id"];
}) {
  return prisma.category.create({
    data: {
      name,
      color,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateCategory({
  id,
  name,
  color,
}: Pick<Category, "id" | "name" | "color">) {
  return prisma.category.update({
    where: { id },
    data: {
      name,
      color,
    },
  });
}

export function deleteCategory({
  id,
  userId,
}: Pick<Category, "id"> & { userId: User["id"] }) {
  return prisma.category.deleteMany({
    where: { id, userId },
  });
}
