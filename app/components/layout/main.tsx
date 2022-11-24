export interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="grid h-full grid-cols-12 gap-4">
      <div className="col-span-2"></div>
      <div className="col-span-8">{children}</div>
      <div className="col-span-2"></div>
    </div>
  );
}
