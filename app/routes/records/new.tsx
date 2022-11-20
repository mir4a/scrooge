import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { getCategories } from "~/models/category.server";

import { createRecord } from "~/models/record.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const info = formData.get("info");
  const date = formData.get("date");
  const value = formData.get("amount");
  const categoryId = formData.get("categoryId");

  const isDateValid =
    date && !(date instanceof File) && /^\d{4}-\d{2}-\d{2}$/.test(date);

  if (typeof info !== "string" || info.length === 0) {
    return json(
      { errors: { name: "info", description: "Info is required" } },
      { status: 400 }
    );
  }

  if (!isDateValid) {
    return json(
      { errors: { name: "date", description: "Date is required" } },
      { status: 400 }
    );
  }

  if (typeof value !== "string" || value.length === 0) {
    return json(
      { errors: { name: "value", description: "Value is required" } },
      { status: 400 }
    );
  }

  console.log("categoryId", categoryId);

  if (categoryId !== null && typeof categoryId !== "string") {
    return json(
      { errors: { name: "category", description: "Category should a string" } },
      { status: 400 }
    );
  }

  const record = await createRecord({
    info,
    date: new Date(date),
    value: Number(value),
    categoryId: categoryId ?? null,
    userId,
  });

  return redirect(`/records/${record.id}`);
}

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });

  return json({ categories });
}

export default function RecordNewPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const infoRef = React.useRef<HTMLTextAreaElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLInputElement>(null);
  const categoryRef = React.useRef<HTMLSelectElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name === "info") {
      infoRef.current?.focus();
    } else if (actionData?.errors?.name === "date") {
      dateRef.current?.focus();
    } else if (actionData?.errors?.name === "value") {
      valueRef.current?.focus();
    } else if (actionData?.errors?.name === "category") {
      categoryRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <label htmlFor="info">Info</label>
          <textarea
            id="info"
            name="info"
            ref={infoRef}
            className="rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            ref={dateRef}
            className="rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            ref={valueRef}
            className="rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            ref={categoryRef}
            className="rounded-md border border-gray-300 p-2"
          >
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn">
          Create
        </button>
      </div>
    </Form>
  );
}
