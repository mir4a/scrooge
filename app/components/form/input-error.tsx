export interface InputErrorProps {
  error?: string;
}

export default function InputError({ error }: InputErrorProps) {
  if (!error) return null;

  return (
    <div className="text-sm font-medium text-red-600 dark:text-pink-400">
      {error}
    </div>
  );
}
