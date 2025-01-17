'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

const Navbar = () => {
  const {status} = useSession();
  return (
    <div className="flex items-center justify-between">
      <Link href={"/"}>
        <h1 className="text-4xl font-medium">notebook</h1>
      </Link>
      {
        status === "authenticated" ? (<Button variant={"secondary"} onClick={()=> signOut()} >Sign Out</Button>): <Button onClick={()=> signIn('google')} >Sign in with Google</Button>
      }
    </div>
  );
};

export default Navbar;
