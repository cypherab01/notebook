import Link from "next/link";
import Image from "next/image";

import logoWhite from "@/public/logo/Notebook White Logo.png";
import logoDark from "@/public/logo/Notebook Dark Logo.png";

import AvatarComponent from "./AvatarComponent";
import { cookies } from "next/headers";
import { SignIn } from "../auth/signin-button";

async function Navbar() {
  const token = (await cookies()).get("token")?.value;

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

      {token ? <AvatarComponent /> : <SignIn />}
    </div>
  );
}

export default Navbar;
