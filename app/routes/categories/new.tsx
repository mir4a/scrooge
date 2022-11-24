import type { ActionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { createCategory } from "~/models/category.server";

import { requireUserId } from "~/session.server";
import Button from "~/components/form/button";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const color = formData.get("color");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "name", description: "Name is required" } },
      { status: 400 }
    );
  }

  if (typeof color !== "string" || color.length === 0) {
    return json(
      { errors: { name: "color", description: "Color is required" } },
      { status: 400 }
    );
  }

  const category = await createCategory({
    name,
    color,
    userId,
  });

  return redirect(`/categories/${category.id}`);
}

export default function NewCategory() {
  const actionData = useActionData<typeof action>();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const colorRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors.name === "name") {
      nameRef.current?.focus();
    }

    if (actionData?.errors.name === "color") {
      colorRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post">
      <div className="flex flex-col space-y-4">
        <label htmlFor="name">Category name</label>
        <input
          id="name"
          type="text"
          className="Input"
          name="name"
          ref={nameRef}
        />

        <label htmlFor="color">Color</label>
        <input id="color" name="color" type="color" ref={colorRef} />

        <Button type="submit" kind="primary">
          Create
        </Button>
      </div>
    </Form>
  );
}
