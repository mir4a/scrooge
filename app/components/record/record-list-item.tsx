import type { Category as ICategory, Record as IRecord } from "@prisma/client";
import { NavLink } from "@remix-run/react";
import { toLocaleDate } from "~/utils/date-time-formatter";
import Currency from "../currency";

export interface RecordListItemProps {
  record: Pick<IRecord, "id" | "info" | "value"> & {
    date: string;
    category?: Pick<ICategory, "id" | "name" | "color"> | null;
  };
}

export default function RecordListItem({ record }: RecordListItemProps) {
  const { id, info, value, date } = record;
  return (
    <li
      className="border-l-8"
      style={{
        borderColor: record.category ? record.category.color : "transparent",
      }}
    >
      <NavLink
        className={({ isActive }) =>
          `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
        }
        to={`/records/${id}`}
      >
        <span className="font-bold">{info}</span>
        <span className="ml-2 text-gray-500">
          <Currency amount={value} coloured />
        </span>
        <span className="ml-2 text-gray-500">{toLocaleDate(date)}</span>
      </NavLink>
    </li>
  );
}
