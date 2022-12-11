import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import Button from "~/components/form/button";
import InputError from "~/components/form/input-error";
import { getCategories } from "~/models/category.server";

import { createRecord } from "~/models/record.server";
import { requireUserId } from "~/session.server";

type ActionData =
  | {
      errors: {
        type: null | string;
        info: null | string;
        date: null | string;
        value: null | string;
        categoryId: null | string;
      };
    }
  | undefined;

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const type = formData.get("type");
  const info = formData.get("info");
  const date = formData.get("date");
  const value = formData.get("amount");
  const categoryId = formData.get("categoryId");

  const isDateValid =
    date && !(date instanceof File) && /^\d{4}-\d{2}-\d{2}$/.test(date);

  const data: ActionData = {
    errors: {
      type: type ? null : "Type is required",
      info: info ? null : "Name is required",
      date: date ? null : "Colour is required",
      value: value ? null : "Value is required",
      categoryId: null,
    },
  };

  if (typeof info !== "string" || info.length === 0) {
    data.errors.info = "Info is required";
    return json(data, { status: 400 });
  }

  if (!isDateValid) {
    data.errors.date = "Date is required";
    return json(data, { status: 400 });
  }

  if (typeof value !== "string" || value.length === 0) {
    data.errors.value = "Value is required";
    return json(data, { status: 400 });
  }

  if (categoryId !== null && typeof categoryId !== "string") {
    data.errors.categoryId = "Category should be a string";
    return json(data, { status: 400 });
  }

  const hasErrors = Object.values(data.errors).some(
    (errorMessage) => errorMessage
  );

  if (hasErrors) {
    return json<ActionData>({ errors: data.errors }, { status: 400 });
  }

  const correctValue = type === "income" ? value : `-${value}`;

  const record = await createRecord({
    info,
    date: new Date(date),
    value: Number(correctValue),
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
  const typeRef = React.useRef<HTMLLabelElement>(null);
  const infoRef = React.useRef<HTMLTextAreaElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLInputElement>(null);
  const categoryRef = React.useRef<HTMLSelectElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.type) {
      typeRef.current?.focus();
    } else if (actionData?.errors?.info) {
      infoRef.current?.focus();
    } else if (actionData?.errors?.date) {
      dateRef.current?.focus();
    } else if (actionData?.errors?.value) {
      valueRef.current?.focus();
    } else if (actionData?.errors?.categoryId) {
      categoryRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <span className="font-semibold">Type of record:</span>
          <label
            htmlFor="type-income"
            ref={typeRef}
            className="flex w-fit items-center"
          >
            Income
            <input
              type="radio"
              name="type"
              id="type-income"
              value="income"
              className="ml-3"
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
            />
          </label>
          {actionData?.errors?.type && (
            <InputError error={actionData.errors.type} />
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="info">Info</label>
          <textarea id="info" name="info" ref={infoRef} className="Input" />
          {actionData?.errors.info && (
            <InputError error={actionData.errors.info} />
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            ref={dateRef}
            className="Input"
          />
          {actionData?.errors.date && (
            <InputError error={actionData.errors.date} />
          )}
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
          />
          {actionData?.errors.value && (
            <InputError error={actionData.errors.value} />
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            ref={categoryRef}
            className="Input"
          >
            <option value="">not selected</option>
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {actionData?.errors.categoryId && (
            <InputError error={actionData.errors.categoryId} />
          )}
        </div>
        <Button type="submit" kind="primary" className="w-fit">
          Create
        </Button>
      </div>
    </Form>
  );
}
