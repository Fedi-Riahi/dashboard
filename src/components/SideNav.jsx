import Link from "next/link";

const SideNav = () => {
  return (
    <div className="flex h-full mx-auto bg-porsche ">
      {/* Sidebar */}
      <div className="bg-black/90 p-5 w-72 flex-shrink-0 ">
        <ul className="flex flex-col  gap-5 ">
          <Link href="/dashboard">
            <li className="py-3 w-full px-8  text-left hover:bg-black/90 text-white rounded-lg ">
              Dashboard
            </li>
          </Link>
          <Link href="/brands">
            <li className="py-3 px-8  hover:bg-black/90 text-white rounded-lg ">
              Brands
            </li>
          </Link>
          <Link href="/listings">
            <li className="py-3 px-8  hover:bg-black/90 text-white rounded-lg ">
              Listing
            </li>
          </Link>
          <Link href="/trims">
            <li className="py-3 px-8  hover:bg-black/90 text-white rounded-lg ">
              Trims
            </li>
          </Link>
          <Link href="/carparts">
            <li className="py-3 px-8  hover:bg-black/90 text-white rounded-lg ">
              Car Parts
            </li>
          </Link>
          <Link href="/carorders">
            <li className="py-3 px-8  hover:bg-black/90 text-white rounded-lg ">
              Car Orders
            </li>
          </Link>
          <Link href="/appointment">
            <li className="py-3 px-8  hover:bg-black/90 text-white rounded-lg ">
              Appointments
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
