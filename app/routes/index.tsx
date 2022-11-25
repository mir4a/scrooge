import { Link } from "@remix-run/react";
import Logo from "~/components/layout/logo";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative scale-150">
        <Logo />
        <div className="absolute inset-0 h-full w-full animate-pulse mix-blend-color-dodge">
          <Logo />
        </div>
      </div>
      <h1 className="text-l -mt-1 text-center font-bold">
        Yet another expense tracker
      </h1>

      <div className="mt-20">
        {user ? (
          <Link to="/dashboard" className="Button Button--primary p-2 px-10">
            Enter here
          </Link>
        ) : (
          <>
            Do I know you?<span className="mx-3 text-3xl">&#128073;</span>{" "}
            <Link to="/login" className="Button Button--primary ml-4 p-2 px-10">
              Login
            </Link>
            <br />
            <br />
            <br />
            Anyway nice to meet you!{" "}
            <span className="mx-3 text-3xl">&#129309;</span>{" "}
            <Link to="/signup" className="Button Button--primary p-2 px-10">
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
