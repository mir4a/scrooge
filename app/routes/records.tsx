import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getRecords } from "~/models/record.server";
import Header from "~/components/layout/header";
import MainLayout from "~/components/layout/main";
import FooterLayout from "~/components/layout/footer";

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
      <MainLayout>
        <div className="grid grid-cols-8 gap-4">
          <div className="col-span-2">
            <Link
              to="new"
              className="Button Button--primary mb-4 block p-2 text-center text-xl font-bold"
            >
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
                        `block border-b p-4 text-xl ${
                          isActive ? "bg-white" : ""
                        }`
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
          <div className="col-span-5 col-start-4">
            <Outlet />
          </div>
        </div>
      </MainLayout>
    </>
  );
}
