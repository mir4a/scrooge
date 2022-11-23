import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CategoryListItem from "~/components/category/category-list-item";
import { ExpensePieChart } from "~/components/dashboard/expense-pie-chart";
import RecordListItem from "~/components/record/record-list-item";

import { getCategories } from "~/models/category.server";
import {
  getExpenses,
  getExpensesGroupedByCategory,
  getIncomes,
  getRecords,
} from "~/models/record.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });
  const records = await getRecords({ userId });
  const incomes = await getIncomes({ userId });
  const expenses = await getExpensesGroupedByCategory({ userId });

  return json({ categories, records, incomes, expenses });
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div>
        <ExpensePieChart data={data.expenses} categories={data.categories} />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Categories</h2>
            <small className="text-gray-500">select to edit or delete</small>
            <ul>
              {data.categories.map((category) => (
                <CategoryListItem key={category.id} category={category} />
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Records</h2>
            <ul>
              {data.records.map((record) => (
                <RecordListItem
                  key={record.id}
                  record={record}
                  category={record.category}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
