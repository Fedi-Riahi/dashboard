import Link from "next/link";
import { UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
const Navbar = () => {
  return (
    <nav className="bg-black pb-2 dark:bg-gray-900">
      <div className="flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <div className="flex  flex-grow gap-4 items-end ">
          <Link
            href="/"
            className='text-xl ml-7 font-bold text-gray-800 dark:text-white"'
          >
            <Image src="/mercedes.png" alt="Mercedes"  width={50} height={50} />
          </Link>
          <span className="font-mercedes-light text-xl  text-white">Sfax Silver Star</span>
        </div>

        {/* Search input */}
        <div className="flex justify-center items-center gap-10">
          <MagnifyingGlassIcon className="text-white cursor-pointer h-6 w-6" />
          <div className="flex justify-center mr-7">
            <UserIcon className="text-white cursor-pointer h-6 w-6" />

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
