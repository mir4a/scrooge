import type { ActionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { createCategory } from "~/models/category.server";

import { requireUserId } from "~/session.server";
import Button from "~/components/form/button";
import InputError from "~/components/form/input-error";

type ActionData =
  | {
      errors: {
        name: null | string;
        color: null | string;
      };
    }
  | undefined;

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const color = formData.get("color");

  const data: ActionData = {
    errors: {
      name: name ? null : "Name is required",
      color: color ? null : "Colour is required",
    },
  };

  const hasErrors = Object.values(data.errors).some(
    (errorMessage) => errorMessage
  );

  if (typeof name !== "string") {
    data.errors.name = "Name should be a string";
  }

  if (typeof color !== "string") {
    data.errors.color = "Colour should be a string";
  }

  if (hasErrors) {
    return json<ActionData>({ errors: data.errors }, { status: 400 });
  }

  const category = await createCategory({
    name: name as string,
    color: color as string,
    userId,
  });

  return redirect(`/categories/${category.id}`);
}

export default function NewCategory() {
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
    <Form method="post">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col">
          <label htmlFor="name">Category name</label>
          <input
            id="name"
            type="text"
            className="Input"
            name="name"
            ref={nameRef}
          />
          {actionData?.errors?.name && (
            <InputError error={actionData.errors.name} />
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="color">Color</label>
          <input
            id="color"
            className="Input"
            name="color"
            type="color"
            ref={colorRef}
            defaultValue="#134e4a"
          />
        </div>

        <Button type="submit" kind="primary" className="w-fit">
          Create
        </Button>
      </div>
    </Form>
  );
}
