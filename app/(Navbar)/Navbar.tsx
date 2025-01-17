"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  const { status, data: session } = useSession();
  return (
    <div className="flex items-center justify-between">
      <Link href={"/"}>
        <h1 className="text-4xl font-medium">notebook</h1>
      </Link>

      {status === "authenticated" ? (
        <>
          <Button variant={"secondary"} onClick={() => signOut()}>
            Sign Out
          </Button>
          {session?.user?.image && (
            <Image
              src={session.user.image}
              width={60}
              alt="Profile Image"
              height={60}
            />
          )}
          {console.log(session?.user)}
        </>
      ) : (
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
      )}
    </div>
  );
};

export default Navbar;
