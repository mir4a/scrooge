import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import Button from "~/components/form/button";
import RecordRow from "~/components/record/record-row";
import { getCategories } from "~/models/category.server";

import { deleteRecord, getRecord, updateRecord } from "~/models/record.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  const categories = await getCategories({ userId });
  invariant(params.recordId, "recordId not found");

  const record = await getRecord({ userId, id: params.recordId });
  if (!record) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ record, categories });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const method = formData.get("_method");
  const type = formData.get("type");
  const info = formData.get("info");
  const date = formData.get("date");
  const value = formData.get("amount");
  const categoryId = formData.get("categoryId");
  invariant(params.recordId, "recordId not found");

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

  const correctValue = type === "income" ? value : `-${value}`;

  if (method === "DELETE") {
    await deleteRecord({ userId, id: params.recordId });
    return redirect("/records");
  }

  await updateRecord({
    id: params.recordId,
    info,
    date: new Date(date),
    value: Number(correctValue),
    categoryId,
  });

  return redirect("/records");
}

export default function RecordDetailsPage() {
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
    <div>
      <h3 className="text-2xl font-bold">Selected record</h3>

      <div className="flex items-center">
        <RecordRow record={data.record} clickable={false} />

        <Form method="post">
          <input type="hidden" name="_method" value="DELETE" />
          <Button kind="secondary" size="small" type="submit">
            Delete
          </Button>
        </Form>
      </div>

      <h4 className="mb-6  mt-8 text-xl font-bold">Edit record:</h4>

      <Form method="post">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-4">
            <span className="font-semibold">Type of record:</span>
            <label htmlFor="type-income" className="flex w-fit items-center">
              Income
              <input
                type="radio"
                name="type"
                id="type-income"
                value="income"
                className="ml-3"
                defaultChecked={data.record.value > 0}
              />
            </label>
            <label htmlFor="type-expense" className="flex w-fit items-center">
              Expense
              <input
                type="radio"
                name="type"
                id="type-expense"
                value="expense"
                className="ml-3"
                defaultChecked={data.record.value < 0}
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label htmlFor="info">Info</label>
            <textarea
              id="info"
              name="info"
              ref={infoRef}
              className="Input"
              key={data.record.id}
              defaultValue={data.record.info}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              ref={dateRef}
              className="Input"
              defaultValue={new Date(data.record.date)
                .toISOString()
                .substring(0, 10)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              ref={valueRef}
              className="Input"
              min={0}
              defaultValue={Math.abs(data.record.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              ref={categoryRef}
              className="Input"
              defaultValue={data.record.category?.id}
            >
              <option value="">not selected</option>
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" kind="primary" className="w-fit">
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Record not found</div>;
  }

  throw new Error(`Unexpected caught response with status:  ${caught.status}`);
}
