import { NavLink } from "@remix-run/react";

export type Category = {
  id: string;
  name: string;
  color: string;
};

export interface CategoryListItemProps {
  category: Category;
}

export default function CategoryListItem({ category }: CategoryListItemProps) {
  const { id, name, color } = category;
  return (
    <li style={{ backgroundColor: color }}>
      <NavLink
        className={({ isActive }) =>
          `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
        }
        to={`/categories/${id}`}
      >
        <span style={{ color: color }} className="invert">
          {name}
        </span>
      </NavLink>
    </li>
  );
}
