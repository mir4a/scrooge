import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getRecords } from "~/models/record.server";
import Header from "~/components/layout/header";
import RecordTable from "~/components/record/record-table";
import MainLayout from "~/components/layout/main";
import { getPaginationTermsFromURL } from "~/utils/pagination-terms";
import {
  Pagination,
  PaginationIndicator,
  PaginationNext,
  PaginationPrev,
  usePagination,
} from "~/components/pagination";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const { cursor, limit, page } = getPaginationTermsFromURL(request.url);
  const { records, pagesTotal, recordsTotal } = await getRecords({
    userId,
    cursor,
    limit,
    page,
  });

  return json({ records, pagesTotal, recordsTotal });
}

export default function RecordsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  const [{ page }, paginationCallback] = usePagination({
    data: data.records,
    total: data.recordsTotal,
  });

  return (
    <>
      <Header username={user.email} />

      <MainLayout>
        <div className="grid grid-cols-4 gap-4">
          <div className="">
            <Link
              to="new"
              className="Button Button--primary mb-10 block w-fit justify-self-end py-3 px-8 text-center text-xl font-bold"
            >
              + New Record
            </Link>
          </div>
          <div className="col-span-3 mb-8">
            <Outlet />
          </div>
        </div>
        {data.records.length === 0 ? (
          <p className="p-4">No records yet</p>
        ) : (
          <>
            <RecordTable records={data.records} />
            <Pagination
              page={Number(page)}
              onChangePage={paginationCallback}
              totalPages={data.pagesTotal}
              className="mt-8"
            >
              <PaginationPrev />
              <PaginationIndicator />
              <PaginationNext />
            </Pagination>
          </>
        )}
      </MainLayout>
    </>
  );
}
