import { NavLink } from "@remix-run/react";
import ColourIndicator from "./colour-indicator";

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
    <li className="group">
      <NavLink
        className={({ isActive }) =>
          `block flex  p-4 text-xl ${isActive ? "bg-white" : ""}`
        }
        to={`/categories/${id}`}
      >
        <ColourIndicator colour={color} className="mr-4" />
        <span className="group-hover:underline group-hover:decoration-2">
          {name}
        </span>
      </NavLink>
    </li>
  );
}
