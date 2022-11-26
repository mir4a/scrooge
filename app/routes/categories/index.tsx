import { Link } from "@remix-run/react";

export default function CategoryIndexPage() {
  return (
    <p>
      No category selected. Select a category on the left, or{" "}
      <Link to="new" className="Link">
        create a new category.
      </Link>
    </p>
  );
}
