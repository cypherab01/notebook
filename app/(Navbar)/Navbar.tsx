"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import logoWhite from "@/public/logo/Notebook White Logo.png";
import logoDark from "@/public/logo/Notebook Dark Logo.png";

const Navbar = () => {
  const { status, data: session } = useSession();
  return (
    <div className="flex items-center justify-between">
      <Link href={"/"}>
        <Image
          src={logoDark}
          alt="Notebook"
          width={48}
          height={48}
          className="hidden dark:block"
        />
        <Image
          src={logoWhite}
          alt="Notebook"
          width={48}
          height={48}
          className="block dark:hidden"
        />
      </Link>
      {status === "authenticated" || status === "loading" ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={session?.user?.image || undefined} />
              <AvatarFallback>NB</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Information</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="focus:bg-transparent select-text"
              onSelect={(e) => e.preventDefault()}
            >
              {session?.user?.name}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="focus:bg-transparent select-text"
              onSelect={(e) => e.preventDefault()}
            >
              {session?.user?.email}
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem>
              <Button
                variant={"ghost"}
                className="w-full p-0"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant={"outline"} onClick={() => signIn("google")}>
          Sign in with Google
        </Button>
      )}
    </div>
  );
};

export default Navbar;
