"use client";

import { Session } from "next-auth";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

interface UserMenuButtonProps {
  session: Session | null;
}

export default function UserMenuButton({ session }: UserMenuButtonProps) {
  const user = session?.user;

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        {user ? (
          <FaUserCircle className="w-10 h-10 rounded-full" />
        ) : (
          <GiHamburgerMenu className="w-6 h-6" />
        )}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box menu-sm z-30 mt-3 w-52 bg-white p-2 shadow"
      >
        {user ? (
          <>
            <li>
              <Link href={"/orders"}>
                <button className="bg-white">Orders</button>
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-white"
              >
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={() => signIn()} className="bg-white">
              Sign In
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
