"use client";

import { Session } from "next-auth";
import { GiHamburgerMenu } from "react-icons/gi";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";

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
        className="dropdown-content menu rounded-box menu-sm z-30 mt-3 w-52 bg-base-100 p-2 shadow"
      >
        <li>
          {user ? (
            <button onClick={() => signOut({ callbackUrl: "/" })}></button>
          ) : (
            <button onClick={() => signIn()} className=""></button>
          )}
        </li>
      </ul>
    </div>
  );
}
