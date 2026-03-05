"use client"

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Input } from "./ui/input";

const Navbar = () => {
  const { data: session, status } = useSession();

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
        {status === "loading" ? (
          <span className="text-xs text-gray-500">Loading...</span>
        ) : status === "authenticated" && session?.user ? (
          <>
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
              <span className="text-xs leading-3 font-medium">
                {session.user.email?.split("@")[0] || "User"}
              </span>
              <span className="text-[10px] text-gray text-right capitalize">
                {session.user.role?.toLowerCase()}
              </span>
            </div>
            <div className="relative group">
              <Image
                src="/avatar.png"
                alt=""
                height={36}
                width={36}
                className="rounded-full cursor-pointer"
              />
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link
            href="/signin"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
