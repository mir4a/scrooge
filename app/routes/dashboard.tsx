import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CategoryListItem from "~/components/category/category-list-item";
import ExpenseIncomeBarChart from "~/components/dashboard/expense-income-bar-chart";
import { ExpensePieChart } from "~/components/dashboard/expense-pie-chart";
import Header from "~/components/layout/header";
import MainLayout from "~/components/layout/main";
import RecordTable from "~/components/record/record-table";

import { getCategories } from "~/models/category.server";
import {
  getExpensesGroupedByCategory,
  getIncomes,
  getRecords,
  getAllWithinDateRange,
} from "~/models/record.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });
  const records = await getRecords({ userId });
  const incomes = await getIncomes({ userId });
  const expenses = await getExpensesGroupedByCategory({ userId });
  const allWithinDateRange = await getAllWithinDateRange({
    userId,
    startDate: "2021-01-01",
    endDate: "2021-12-31",
  });

  return json({ categories, records, incomes, expenses, allWithinDateRange });
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <>
      <Header username={user.email} />
      <MainLayout>
        <div className="grid grid-cols-8 gap-4">
          <div className="col-span-4">
            <ExpensePieChart
              data={data.expenses}
              categories={data.categories}
            />
          </div>
          <div className="col-span-4">
            <ExpenseIncomeBarChart data={data.allWithinDateRange} />
          </div>
        </div>
        <div className="grid-cols-16 grid gap-4">
          <div className="col-span-6">
            <h2 className="text-xl font-bold">Categories</h2>
            <small className="text-gray-500 dark:text-stone-300">
              select to edit or delete
            </small>
            <ul>
              {data.categories.map((category) => (
                <CategoryListItem key={category.id} category={category} />
              ))}
            </ul>
          </div>

          <div className="col-span-9 col-start-8">
            <h2 className="mb-8 text-xl font-bold">All records</h2>
            <RecordTable records={data.records} />
          </div>
        </div>
      </MainLayout>
    </>
  );
}
