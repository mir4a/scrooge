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
    include: { category: true },
    orderBy: { date: "desc" },
  });
}

// Cursor based pagination
// 1. first page
// 1.1. do we go to the next page?
// 1.1.1. cursor is the last record id
// 1.1.2. skip 1 record (the last one)
// 1.2. do we go to the previous page?
// 1.2.1. prevent from querying since we don't have the previous page cursor (or return the first page query) or return memoized query
// 1.2.2. cursor is the last record id
// 1.2.3. skip 0 records
// 2. second/n-th page
// 2.1. do we go to the next page?
// 2.1.1. cursor is the last record id
// 2.1.2. skip 1 record (the last one)
// 2.2. do we go to the previous page?
// 2.2.1. cursor is the first record id
// 2.2.2. skip 1 record (the first one)
// 3. last page
// 3.1. do we go to the next page?
// 3.1.1. prevent from querying since we don't have the next page cursor (or return the last page query) or return memoized query
// 3.1.2. cursor is the first record id
// 3.1.3. skip 0 records
// 3.2. do we go to the previous page?
// 3.2.1. cursor is the first record id
// 3.2.2. skip 1 record (the first one)
export async function getRecordsByDateRange({
  userId,
  startDate,
  endDate,
  cursor,
  limit,
  page,
}: {
  userId: User["id"];
  startDate: string;
  endDate: string;
  limit?: string | null;
  cursor?: string | null;
  page?: string | null;
}) {
  const predicate = {
    userId,
    date: {
      gte: new Date(startDate).toISOString(),
      lte: new Date(endDate).toISOString(),
    },
  };
  const recordsTotal = await prisma.record.count({
    where: {
      ...predicate,
    },
  });
  const pagesTotal = Math.ceil(recordsTotal / Math.abs(Number(limit)));
  const parsedPage = Number(page);

  const isFirstPage = parsedPage === 1;
  const isInitialPage = parsedPage === 0;
  const isBackward = Number(limit) < 0;
  const isLastPage = parsedPage >= pagesTotal;
  const isWeirdPageAndNoCursor = (parsedPage > 1 || parsedPage < 0) && !cursor;
  const skip =
    (isInitialPage && !isBackward) ||
    isWeirdPageAndNoCursor ||
    (isLastPage && !isBackward)
      ? 0
      : 1;

  console.log({
    page,
    parsedPage,
    pagesTotal,
    isFirstPage,
    isInitialPage,
    isBackward,
    isLastPage,
    skip,
    cursor,
    recordsTotal,
    limit,
  });

  const records = await prisma.record.findMany({
    take: Number(limit),
    skip,
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      ...predicate,
    },
    include: {
      category: {
        select: { name: true, color: true },
      },
    },
    orderBy: { date: "desc" },
  });

  return {
    records,
    recordsTotal,
    pagesTotal,
  };
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

export function getAllWithinDateRange({
  userId,
  startDate,
  endDate,
}: {
  userId: User["id"];
  startDate: string;
  endDate: string;
}) {
  return prisma.record.groupBy({
    where: {
      userId,
      date: {
        gte: new Date(startDate).toISOString(),
        lte: new Date(endDate).toISOString(),
      },
    },
    by: ["date"],
    _count: {
      _all: true,
      value: true,
    },
    _sum: { value: true },
    orderBy: { date: "desc" },
  });
}
