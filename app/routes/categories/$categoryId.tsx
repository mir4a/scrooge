import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import * as React from "react";
import invariant from "tiny-invariant";

import { getCategory, deleteCategory } from "~/models/category.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.categoryId, "categoryId not found");

  const category = await getCategory({ id: params.categoryId, userId });
  if (!category) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ category });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.categoryId, "categoryId not found");

  await deleteCategory({ id: params.categoryId, userId });

  return redirect("/categories");
}

export default function CategoryDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.category.name}</h3>
      <p className="py-6">{data.category.color}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}
