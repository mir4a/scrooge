import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getRecords } from "~/models/record.server";
import Header from "~/components/layout/header";
import MainLayout from "~/components/layout/main";
import RecordTable from "~/components/record/record-table";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const records = await getRecords({ userId });
  return json({ records });
}

export default function RecordsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <>
      <Header username={user.email} />

      <div className="grid grid-cols-12 gap-4 py-8">
        <div className="col-span-5 col-start-2">
          <Link
            to="new"
            className="Button Button--primary mb-10 block w-fit justify-self-end py-3 px-8 text-center text-xl font-bold"
          >
            + New Record
          </Link>

          {data.records.length === 0 ? (
            <p className="p-4">No records yet</p>
          ) : (
            <RecordTable records={data.records} />
          )}
        </div>
        <div className="col-span-4 col-start-8">
          <Outlet />
        </div>
      </div>
    </>
  );
}
