import { Link } from "@remix-run/react";

export default function RecordIndexPage() {
  return (
    <p>
      No record selected. Select a record on the left, or{" "}
      <input type="date" onChange={console.log} />
      <Link to="new" className="text-blue-500 underline">
        create a new record.
      </Link>
    </p>
  );
}
