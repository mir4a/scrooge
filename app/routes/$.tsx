import Logo from "~/components/layout/logo";

export default function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Logo />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
        404
      </h1>
      <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
        Page not found.
      </p>
    </div>
  );
}
