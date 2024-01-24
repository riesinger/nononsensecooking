// import logo from './logo.svg'; // Assuming you have a logo.svg file in your project

import { Link } from "@remix-run/react";

function AppHeader() {
  return (
    <header className="px-8 py-4 m-0 w-full flex items-center justify-between flex-wrap gap-6 relative">
      <Link
        to="/"
        className="flex items-center max-w-full cursor-pointer gap-3"
      >
        <span className="bg-primary size-12 rounded-lg p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="fg-primary-foreground size-8 rotate-12 origin-center"
          >
            <title>NoNonsenseCooking logo</title>
            <path
              fill="white"
              d="M12.5,1.5C10.73,1.5 9.17,2.67 8.67,4.37C8.14,4.13 7.58,4 7,4A4,4 0 0,0 3,8C3,9.82 4.24,11.41 6,11.87V19H19V11.87C20.76,11.41 22,9.82 22,8A4,4 0 0,0 18,4C17.42,4 16.86,4.13 16.33,4.37C15.83,2.67 14.27,1.5 12.5,1.5M12,10.5H13V17.5H12V10.5M9,12.5H10V17.5H9V12.5M15,12.5H16V17.5H15V12.5M6,20V21A1,1 0 0,0 7,22H18A1,1 0 0,0 19,21V20H6Z"
            />
          </svg>
        </span>
        <span className="text-2xl m-0 font-medium tracking-tight hidden lg:block">
          NoNonsenseCooking
        </span>
      </Link>
      <div className="flex items-center">
        {" "}
        {/* Navigation menu and search bar */}
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
        <input
          type="search"
          placeholder="Search..."
          className="ml-4 p-2 rounded-md"
        />
      </div>
    </header>
  );
}

export default AppHeader;
