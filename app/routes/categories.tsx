import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getCategories } from "~/models/category.server";
import CategoryListItem from "~/components/category-list-item";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });
  return json({ categories });
}

export default function CategoriesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Categories</Link>
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
            + New Category
          </Link>

          <hr />

          {data.categories.length === 0 ? (
            <p className="p-4">No categories yet</p>
          ) : (
            <ol>
              {data.categories.map((category) => (
                <CategoryListItem key={category.id} category={category} />
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
