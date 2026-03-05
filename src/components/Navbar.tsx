"use client"

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Input } from "./ui/input";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 p-2 sm:p-4">
      {/*Search Bar*/}
      <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
        <Input
          type="search"
          placeholder="🔍 Search..."
          className="w-full sm:w-[200px] md:w-[250px] p-2 rounded-full outline-none"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 justify-end">
        {status === "loading" ? (
          <span className="text-xs text-gray-500">Loading...</span>
        ) : status === "authenticated" && session?.user ? (
          <>
            <button className="bg-white rounded-full w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer min-w-[40px]">
              <Image src="/message.png" alt="Messages" width={20} height={20} />
            </button>
            <button className="bg-white rounded-full w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer relative min-w-[40px]">
              <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-4 sm:h-4 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
                1
              </div>
            </button>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs leading-3 font-medium truncate max-w-[100px]">
                {session.user.email?.split("@")[0] || "User"}
              </span>
              <span className="text-[10px] text-gray text-right capitalize">
                {session.user.role?.toLowerCase()}
              </span>
            </div>
            <div className="relative group">
              <Image
                src="/avatar.png"
                alt="User"
                height={40}
                width={40}
                className="rounded-full cursor-pointer min-w-[40px]"
              />
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-4 py-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link
            href="/signin"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
