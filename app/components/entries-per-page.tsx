export interface EntriesPerPageProps {
  limit?: number;
  onChange?: (entriesPerPage: number) => void;
}

export default function EntriesPerPage({
  limit,
  onChange,
}: EntriesPerPageProps) {
  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-700">Entries per page</span>
      <select
        className="Input"
        defaultValue={limit}
        onChange={(e) => onChange && onChange(parseInt(e.target.value))}
      >
        <option>10</option>
        <option>25</option>
        <option>50</option>
        <option>100</option>
      </select>
    </div>
  );
}
