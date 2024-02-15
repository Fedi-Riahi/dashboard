import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";
const Navbar = () => {
  return (
    <nav className="bg-porsche border-b border-gray-200 dark:bg-gray-900">
      <div className="flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <div className="flex items-center flex-grow">
          <Link
            href="/"
            className='text-xl ml-7 font-bold text-gray-800 dark:text-white"'
          >
            AutoPulse
          </Link>
        </div>

        {/* Search input */}
        <div className="flex justify-center items-center gap-10">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border bg-porsche border-gray-600 rounded-lg focus:outline-none  w-80"
          />

          <div className="flex justify-center mr-7">
            <UserIcon className="text-gray-800 cursor-pointe h-6 w-6" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
