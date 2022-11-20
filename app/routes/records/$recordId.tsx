import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteRecord, getRecord } from "~/models/record.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.recordId, "recordId not found");

  const record = await getRecord({ userId, id: params.recordId });
  if (!record) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ record });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.recordId, "recordId not found");

  await deleteRecord({ userId, id: params.recordId });

  return redirect("/records");
}

export default function RecordDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.record.info}</h3>
      <p className="py-6">{data.record.value}</p>
      <p className="py-6">{data.record.date}</p>
      <p className="py-6">
        {data.record.category ? data.record.category.name : "not categorised"}
      </p>
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
