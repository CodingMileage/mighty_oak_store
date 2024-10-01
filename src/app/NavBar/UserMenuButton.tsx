"use client";

import { Session } from "next-auth";
import { GiHamburgerMenu } from "react-icons/gi";
import Image from "next/image";
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
          <Image
            src={user.image}
            width={40}
            height={40}
            alt="profile"
            className="w-10 rounded-full "
          />
        ) : (
          <GiHamburgerMenu />
        )}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box menu-sm z-30 mt-3 w-52 bg-white p-2 shadow"
      >
        <li>
          {user ? (
            <>
              <Link href={"/orders"}>
                <button className="bg-white">Orders</button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => signIn()} className="bg-white">
              Sign In
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}
