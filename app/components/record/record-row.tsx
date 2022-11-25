import type { Record } from "./record-table";
import { toLocaleDate } from "~/utils/date-time-formatter";
import Currency from "../currency";
import ColourIndicator from "../category/colour-indicator";
import { useNavigate } from "@remix-run/react";

export interface RecordRowProps {
  record: Record;
}

export default function RecordRow({ record }: RecordRowProps) {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/records/${record.id}`);
  };

  return (
    <div
      className="group table-row cursor-pointer hover:bg-slate-50"
      onClick={handleRowClick}
    >
      <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {toLocaleDate(record.date)}
      </div>
      <div className="table-cell border-b border-slate-100 p-4 text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {record.category && (
          <div className="flex items-baseline">
            <ColourIndicator
              colour={record.category?.color}
              className="mr-2 scale-50 self-center"
            />
            {record.category?.name}
          </div>
        )}
      </div>
      <div className="table-cell border-b border-slate-100 p-4 text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {record.info}
      </div>
      <div className="table-cell border-b border-slate-100 p-4 pr-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <Currency amount={record.value} coloured />
      </div>
    </div>
  );
}
