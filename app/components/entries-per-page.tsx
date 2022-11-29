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
        defaultValue={limit && Math.abs(limit)}
        onChange={(e) => onChange && onChange(parseInt(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
}
