import Image from "next/image";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex justify-between p-4 ">
      {/*Search Bar*/}
      <div className="hidden md:flex items-center gap-2 text-sm px-4 ">
        <Input
          type="search"
          placeholder="🔍 Search..."
          className="w-[200px] p-2 rounded-full  outline-none"
        />
      </div>

      <div className="w-full flex items-center gap-2 justify-end">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center  text cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-3 h-3 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col ">
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray text-right">Admin</span>
        </div>
        <Image
          src="/avatar.png"
          alt=""
          height={36}
          width={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
