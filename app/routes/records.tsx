import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getRecords } from "~/models/record.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const records = await getRecords({ userId });
  return json({ records });
}

export default function RecordsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Records</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Record
          </Link>

          <hr />

          {data.records.length === 0 ? (
            <p className="p-4">No records yet</p>
          ) : (
            <ol>
              {data.records.map((record) => (
                <li key={record.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={record.id}
                  >
                    📝 {record.info}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
