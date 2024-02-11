import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900">
      <div className="flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <div className="flex items-center flex-grow">
          <Link href="/" className='text-xl ml-7 font-bold text-gray-800 dark:text-white"'>
            Logo
          </Link>
        </div>
        
        {/* Search input */}
        <div className="flex justify-center items-center gap-10">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-800 rounded-lg focus:outline-none  w-80"
          />

        <div className='flex justify-center'>
          <span className='text-gray-800 cursor-pointer'>Notifications</span>
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
