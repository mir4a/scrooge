import type { User, Record } from "@prisma/client";

import { prisma } from "~/db.server";
import { DEFAULT_RECORDS_PER_PAGE } from "~/utils/pagination-const";
import paginationHelper from "~/utils/pagination-helper.server";

export type { Record } from "@prisma/client";

export interface PaginationBaseParams {
  page?: string | null;
  limit?: string | null;
  cursor?: string | null;
}

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

export interface GetRecordsParams extends PaginationBaseParams {
  userId: User["id"];
}
export interface GetRecordsResult {
  records: Record[];
  pagesTotal: number;
  recordsTotal: number;
}
export async function getRecords({
  userId,
  page,
  limit,
  cursor,
}: GetRecordsParams): Promise<GetRecordsResult> {
  const predicate = { userId };
  const recordsTotal = await prisma.record.count({ where: predicate });
  const { skip, take, pagesTotal } = paginationHelper({
    total: recordsTotal,
    cursor,
    limit,
    page,
  });
  const records = await prisma.record.findMany({
    take,
    skip,
    cursor: cursor ? { id: cursor } : undefined,
    where: predicate,
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return { records, pagesTotal, recordsTotal };
}

export interface GetRecordsByDateRangeParams extends PaginationBaseParams {
  userId: User["id"];
  startDate: string;
  endDate: string;
}
export interface GetRecordsByDateRangeResult {
  records: Record[];
  recordsTotal: number;
  pagesTotal: number;
}
export async function getRecordsByDateRange({
  userId,
  startDate,
  endDate,
  cursor,
  limit,
  page,
}: GetRecordsByDateRangeParams): Promise<GetRecordsByDateRangeResult> {
  const predicate = {
    userId,
    date: {
      gte: new Date(startDate).toISOString(),
      lte: new Date(endDate).toISOString(),
    },
  };
  // Unfortunatelly, Prisma doesn't have total count in findMany and therefore I have to have 2 queries for nicely controlled pagination, ref: https://github.com/prisma/prisma/issues/7550
  const recordsTotal = await prisma.record.count({
    where: {
      ...predicate,
    },
  });

  const { skip, take, pagesTotal } = paginationHelper({
    total: recordsTotal,
    cursor,
    limit,
    page,
  });

  console.table({ skip, take, pagesTotal, recordsTotal, cursor, limit, page });

  const records = await prisma.record.findMany({
    take,
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
    take: DEFAULT_RECORDS_PER_PAGE,
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
    take: DEFAULT_RECORDS_PER_PAGE,
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
    take: DEFAULT_RECORDS_PER_PAGE,
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
