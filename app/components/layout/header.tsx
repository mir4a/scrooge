export interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-2">
      <h1 className="text-2xl font-bold">Budget</h1>
      <div className="flex items-center">
        <span className="mr-2 text-gray-500">Logged in as</span>
        <span className="font-bold">{username}</span>
      </div>
    </header>
  );
}
