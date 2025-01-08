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
      <div className="w-[14% ] md:w-[8%] lg:w-[16%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block">NSMS</span>
        </Link>
        <Menu />
      </div>
      <div className="w-[86%]  p-4 bg-gray-100 overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
