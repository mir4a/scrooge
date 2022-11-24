import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import * as React from "react";
import invariant from "tiny-invariant";
import ColourIndicator from "~/components/category/colour-indicator";
import Button from "~/components/form/button";

import {
  getCategory,
  updateCategory,
  deleteCategory,
} from "~/models/category.server";
import { requireUserId } from "~/session.server";

type ActionData =
  | {
      name: null | string;
      color: null | string;
    }
  | undefined;

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
  const formData = await request.formData();
  const method = formData.get("_method");
  const name = formData.get("name");
  const color = formData.get("color");

  invariant(params.categoryId, "categoryId not found");

  const errors: ActionData = {
    name: name ? null : "Name is required",
    color: color ? null : "Colour is required",
  };

  if (method === "DELETE") {
    await deleteCategory({ id: params.categoryId, userId });
    return redirect("/categories");
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  await updateCategory({
    id: params.categoryId,
    name: name as string,
    color: color as string,
  });

  return redirect(`/categories`);
}

export default function CategoryDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="flex items-center text-2xl font-bold">
          <ColourIndicator colour={data.category.color} className="mr-4" />
          {data.category.name}
        </h3>
        <Form method="post">
          <input type="hidden" name="_method" value="DELETE" />
          <Button kind="secondary" size="small" type="submit">
            Delete
          </Button>
        </Form>
      </div>
      <hr className="my-4 " />
      <Form method="post">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col">
            <label className="mb-2" htmlFor="name">
              Update the name
            </label>
            <input
              id="name"
              type="text"
              className="Input"
              name="name"
              defaultValue={data.category.name}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2" htmlFor="color">
              Update the color
            </label>
            <input
              type="color"
              id="color"
              className="Input"
              name="color"
              defaultValue={data.category.color}
            />
          </div>
          <Button type="submit" className="w-fit">
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
}
