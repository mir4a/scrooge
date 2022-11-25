import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CategoryListItem from "~/components/category/category-list-item";
import { ExpensePieChart } from "~/components/dashboard/expense-pie-chart";
import Header from "~/components/layout/header";
import MainLayout from "~/components/layout/main";
import RecordTable from "~/components/record/record-table";

import { getCategories } from "~/models/category.server";
import {
  getExpensesGroupedByCategory,
  getIncomes,
  getRecords,
} from "~/models/record.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

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
          <div className="col-span-4">another chart</div>
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
              <h2 className="text-xl font-bold">All records</h2>
              <RecordTable records={data.records} />
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
