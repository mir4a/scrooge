import type { Category as ICategory, Record as IRecord } from "@prisma/client";
import { NavLink } from "@remix-run/react";

export interface RecordListItemProps {
  record: Pick<IRecord, "id" | "info" | "date" | "value">;
  category: Pick<ICategory, "id" | "name" | "color">;
}

export default function RecordListItem({
  record,
  category,
}: RecordListItemProps) {
  const { id, info, value, date } = record;
  return (
    <li
      className="border-l-8"
      style={{
        borderColor: category ? category.color : "transparent",
      }}
    >
      <NavLink
        className={({ isActive }) =>
          `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
        }
        to={`/records/${id}`}
      >
        <span className="font-bold">{info}</span>
        <span className="ml-2 text-gray-500">{value}</span>
        <span className="ml-2 text-gray-500">{String(date)}</span>
      </NavLink>
    </li>
  );
}
