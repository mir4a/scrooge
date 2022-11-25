import { Link } from "@remix-run/react";

export default function RecordIndexPage() {
  return (
    <p>
      No record selected. Select a record on the left, or{" "}
      <Link to="new" className="Link">
        create a new record.
      </Link>
    </p>
  );
}
