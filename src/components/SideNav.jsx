import Link from 'next/link';

const SideNav = () => {
  return (
    <div className="flex h-full my-auto">
      {/* Sidebar */}
      <div className="bg-prosche m-5 border-r border-gray-200 w-52 flex-shrink-0 rounded-lg">
        <ul>
          <Link href="/dashboard">
            <li className="py-2 px-4 mx-2 hover:bg-gray-300 text-zinc rounded-lg ">
                Dashboard
            </li>
          </Link>
          <Link href="/brands">
            <li className="py-2 px-4 mx-2 hover:bg-gray-300 text-zinc rounded-lg ">
                Brands
            </li>
          </Link>
          {/* Add more links as needed */}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
