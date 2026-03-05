import Menu from "@/components/Menu";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="h-screen flex">
      {/*SIDEBAR NAVIGATION*/}
      <div className="w-16 sm:w-20 md:w-24 lg:w-64 xl:w-72 p-2 sm:p-4 border-r border-gray-200 flex flex-col">
        <Link
          href="/"
          className="flex items-center justify-center md:justify-start gap-2 mb-4"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} className="min-w-[32px]" />
          <span className="hidden md:block font-bold text-lg">NSMS</span>
        </Link>
        <Menu />
      </div>
      <div className="flex-1 p-2 sm:p-4 bg-gray-100 overflow-auto flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
