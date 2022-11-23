import type { User, Record } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Record } from "@prisma/client";

export function getRecord({
  id,
  userId,
}: Pick<Record, "id"> & {
  userId: User["id"];
}) {
  return prisma.record.findFirst({
    select: { id: true, info: true, date: true, value: true, category: true },
    where: { id, userId },
  });
}

export function getRecords({ userId }: { userId: User["id"] }) {
  return prisma.record.findMany({
    where: { userId },
    select: { id: true, info: true, date: true, value: true, category: true },
    orderBy: { date: "desc" },
  });
}

export function getRecordsByCategory({
  userId,
  categoryId,
}: {
  userId: User["id"];
  categoryId: string;
}) {
  return prisma.record.findMany({
    where: { userId, categoryId },
    select: { id: true, info: true, date: true, value: true, category: true },
    orderBy: { date: "desc" },
  });
}

export function createRecord({
  info,
  date,
  value,
  categoryId,
  userId,
}: Pick<Record, "info" | "date" | "value" | "categoryId"> & {
  userId: User["id"];
}) {
  return prisma.record.create({
    data: {
      info,
      date,
      value,
      user: {
        connect: {
          id: userId,
        },
      },
      ...(categoryId && {
        category: {
          connect: {
            id: categoryId,
          },
        },
      }),
    },
  });
}

export function updateRecord({
  id,
  info,
  date,
  value,
  categoryId,
}: Pick<Record, "id" | "info" | "date" | "value" | "categoryId">) {
  return prisma.record.update({
    where: { id },
    data: {
      info,
      date,
      value,
      ...(categoryId && {
        category: {
          connect: {
            id: categoryId,
          },
        },
      }),
    },
  });
}

export function deleteRecord({
  id,
  userId,
}: Pick<Record, "id"> & { userId: User["id"] }) {
  return prisma.record.deleteMany({
    where: { id, userId },
  });
}

export function getExpenses({ userId }: { userId: User["id"] }) {
  return prisma.record.findMany({
    where: { userId, value: { lt: 0 } },
    select: { id: true, info: true, date: true, value: true, category: true },
    orderBy: { date: "desc" },
  });
}

export function getExpensesGroupedByCategory({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.record.groupBy({
    where: { userId, value: { lt: 0 } },
    by: ["categoryId"],
    _count: {
      _all: true,
      value: true,
    },
    // select: {
    //   categoryId: true,
    //   value: true,
    // },
    _sum: { value: true },
  });
}

export function getIncomes({ userId }: { userId: User["id"] }) {
  return prisma.record.findMany({
    where: { userId, value: { gt: 0 } },
    select: { id: true, info: true, date: true, value: true, category: true },
    orderBy: { date: "desc" },
  });
}
