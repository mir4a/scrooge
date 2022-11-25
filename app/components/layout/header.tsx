import { Form, Link, NavLink } from "@remix-run/react";
import Logo from "./logo";

export interface HeaderProps {
  username?: string;
}

export default function Header({ username }: HeaderProps) {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `p-2 mx-3 border-b-2  hover:border-b-emerald-500 ${
      isActive ? "border-b border-b-teal-900 " : "border-b-transparent"
    }`;

  return (
    <header className="mb-10 grid grid-cols-12 place-items-center gap-4">
      <div className="col-span-2"></div>
      <div className="col-span-8">
        <h1 className="mb-5 text-center font-bold">
          <Logo />
          {username && (
            <>
              <br />
              <span className="text-m -mt-4 block">by {username}</span>
            </>
          )}
        </h1>

        <nav className="text-center font-bold">
          <NavLink className={navLinkClasses} to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={navLinkClasses} to="/records">
            Records
          </NavLink>
          <NavLink className={navLinkClasses} to="/categories">
            Categories
          </NavLink>
        </nav>
      </div>
      <div className="col-span-2">
        {username ? (
          <Form action="/logout" method="post">
            <button type="submit" className="group">
              <span className="text-4xl">
                <span className="inline-block group-hover:animate-bounce">
                  &#9758;
                </span>
                &#128682;
                <span className="invisible group-hover:visible">&#128694;</span>
              </span>
              <br />
              <span className="group-hover:underline">Logout</span>
            </button>
          </Form>
        ) : (
          <Link to="/login" className="hover:bg-blue-500 active:bg-blue-600">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
