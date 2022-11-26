import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import invariant from "tiny-invariant";
import ColourIndicator from "~/components/category/colour-indicator";
import Button from "~/components/form/button";
import InputError from "~/components/form/input-error";

import {
  getCategory,
  updateCategory,
  deleteCategory,
} from "~/models/category.server";
import { requireUserId } from "~/session.server";

type ActionData =
  | {
      errors: {
        name: null | string;
        color: null | string;
      };
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

  const data: ActionData = {
    errors: {
      name: name ? null : "Name is required",
      color: color ? null : "Colour is required",
    },
  };

  if (typeof name !== "string") {
    data.errors.name = "Name should be a string";
  }

  if (method === "DELETE") {
    await deleteCategory({ id: params.categoryId, userId });
    return redirect("/categories");
  }

  const hasErrors = Object.values(data.errors).some(
    (errorMessage) => errorMessage
  );

  if (hasErrors) {
    return json<ActionData>({ errors: data.errors }, { status: 400 });
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
  const actionData = useActionData<typeof action>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const colorRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }

    if (actionData?.errors?.color) {
      colorRef.current?.focus();
    }
  }, [actionData]);

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
              key={data.category.id}
              name="name"
              ref={nameRef}
              defaultValue={data.category.name}
            />
            {actionData?.errors?.name && (
              <InputError error={actionData.errors.name} />
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-2" htmlFor="color">
              Update the color
            </label>
            <input
              type="color"
              id="color"
              key={data.category.id}
              className="Input"
              name="color"
              ref={colorRef}
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
