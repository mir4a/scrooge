import type { Category as ICategory, Record as IRecord } from "@prisma/client";
import RecordRow from "./record-row";

export type Record = Pick<IRecord, "id" | "info" | "value"> & {
  date: string;
  category?: Pick<ICategory, "id" | "name" | "color"> | null;
};

export interface RecordTableProps {
  records: Record[];
}

export default function RecordTable({ records }: RecordTableProps) {
  return (
    <div className="table w-full table-auto border-collapse text-lg">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell border-b p-4 pl-8 pt-0 pb-3 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
            Date
          </div>
          <div className="table-cell border-b p-4 pt-0 pb-3 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
            Category
          </div>
          <div className="table-cell border-b p-4 pt-0 pb-3 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
            Info
          </div>
          <div className="table-cell border-b p-4 pr-8 pt-0 pb-3 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200">
            Value
          </div>
        </div>
      </div>
      <div className="table-row-group bg-white dark:bg-slate-800">
        {records.map((record) => (
          <RecordRow key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
