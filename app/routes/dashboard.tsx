import type { LoaderArgs } from "@remix-run/node";
import type { Category as ICategory } from "~/models/category.server";
import type { Record as IRecord } from "~/models/record.server";
import { getRecordsByDateRange } from "~/models/record.server";
import { json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";

import CategoryListItem from "~/components/category/category-list-item";
import ExpenseIncomeBarChart from "~/components/dashboard/expense-income-bar-chart";
import { ExpensePieChart } from "~/components/dashboard/expense-pie-chart";
import Button from "~/components/form/button";
import Header from "~/components/layout/header";
import MainLayout from "~/components/layout/main";
import RecordTable from "~/components/record/record-table";

import { getCategories } from "~/models/category.server";
import {
  getExpensesGroupedByCategory,
  getIncomes,
  getAllWithinDateRange,
} from "~/models/record.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import {
  Pagination,
  PaginationIndicator,
  PaginationNext,
  PaginationPrev,
  usePagination,
} from "~/components/pagination";
import EntriesPerPage from "~/components/entries-per-page";
import { queryToFormData } from "~/utils/query-to-form-data";
import {
  PaginationTerms,
  getPaginationTermsFromURL,
} from "~/utils/pagination-terms";

export type LoaderData = {
  categories: Pick<ICategory, "id" | "color" | "name">[];
  records: IRecord[];
  expenses: any[];
  incomes: any[];
  recordsTotal: number;
  pagesTotal: number;
  allWithinDateRange: any[];
  error?: string;
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  const { cursor, limit, page, prevPage } = getPaginationTermsFromURL(
    request.url
  );
  const dateNow = new Date();
  dateNow.setUTCHours(0, 0, 0, 0);
  dateNow.setUTCDate(1);
  const endOfMonth = new Date(dateNow);
  endOfMonth.setUTCMonth(dateNow.getUTCMonth() + 1);
  endOfMonth.setUTCHours(23, 59, 59, 999);
  const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

  const isStartDateValid = startDate ? DATE_REGEX.test(startDate) : true;
  const isEndDateValid = endDate ? DATE_REGEX.test(endDate) : true;

  if (!isStartDateValid || !isEndDateValid) {
    return json<LoaderData>(
      {
        error: "Invalid date format. Use YYYY-MM-DD",
        categories: [],
        expenses: [],
        records: [],
        recordsTotal: 0,
        pagesTotal: 0,
        incomes: [],
        allWithinDateRange: [],
      },
      { status: 400 }
    );
  }

  const dateRange = {
    startDate: startDate || dateNow.toISOString().substring(0, 10),
    endDate: endDate || endOfMonth.toISOString().substring(0, 10),
  };

  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });
  const { records, recordsTotal, pagesTotal } = await getRecordsByDateRange({
    userId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    cursor,
    limit,
    page,
    prevPage,
  });
  const incomes = await getIncomes({ userId });
  const expenses = await getExpensesGroupedByCategory({ userId });
  const allWithinDateRange = await getAllWithinDateRange({
    userId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  return json<LoaderData>({
    error: undefined,
    categories,
    records,
    recordsTotal,
    pagesTotal,
    incomes,
    expenses,
    allWithinDateRange,
  });
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const [{ limit, page }, paginationCallback] = usePagination({
    data: data.records,
    total: data.recordsTotal,
  });

  const submit = useSubmit();

  const handleEntriesPerPage = (newEntriesPerPage: number) => {
    // existing query params to FormData
    const formData = queryToFormData(searchParams);
    // update form data with new cursor
    formData.set(PaginationTerms.LIMIT, String(newEntriesPerPage));
    submit(formData);
  };

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
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
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

          <div className="col-span-7 col-start-6">
            <div className="my-5 border-y-2 py-4 dark:border-stone-700">
              {data.error && (
                <div className="my-5 bg-red-500 p-4 text-white dark:bg-pink-500">
                  {data.error}
                </div>
              )}
              <Form method="get">
                <div className="flex items-center space-x-5">
                  <div>
                    <label htmlFor="startDate" className="mr-4">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      className="Input"
                      defaultValue={startDate ?? ""}
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="mr-4">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      className="Input"
                      defaultValue={endDate ?? ""}
                    />
                  </div>
                  <Button type="submit">Filter</Button>
                </div>
              </Form>
            </div>
            <h2 className="mb-8 text-xl font-bold">All records</h2>
            <RecordTable records={data.records} />
            <Pagination
              page={Number(page)}
              onChangePage={paginationCallback}
              totalPages={data.pagesTotal}
              className="mt-8"
            >
              <div className="flex items-center space-x-4">
                <PaginationPrev />
                <PaginationIndicator />
                <PaginationNext />
                <EntriesPerPage
                  onChange={handleEntriesPerPage}
                  limit={Number(limit)}
                />
              </div>
            </Pagination>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

// export function CatchBoundary() {
//   const caught = useCatch();
//   console.log(caught);

//   return (
//     <div className="text-red-500">
//       <h1>Something went wrong</h1>
//       <pre>{caught.statusText}</pre>
//     </div>
//   );
// }

// export function ErrorBoundary({ error }: any) {
//   return (
//     <div>
//       <h1>NONONONO</h1>
//       <p>{error.message}</p>
//       <p>The stack trace is:</p>
//       <pre>{error.stack}</pre>
//     </div>
//   );
// }
