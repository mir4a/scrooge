import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getCategories } from "~/models/category.server";
import CategoryListItem from "~/components/category/category-list-item";
import Header from "~/components/layout/header";
import MainLayout from "~/components/layout/main";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });
  return json({ categories });
}

export default function CategoriesPage() {
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
              className="Button Button--primary mb-10 block w-fit justify-self-end py-3 px-8 text-center text-xl font-bold"
            >
              + New Category
            </Link>

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
          <div className="col-span-5 col-start-4">
            <Outlet />
          </div>
        </div>
      </MainLayout>
    </>
  );
}
