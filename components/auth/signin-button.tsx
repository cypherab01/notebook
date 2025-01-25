import Link from "next/link";
import { cookies } from "next/headers";

export async function SignIn() {
  const token = (await cookies()).get("token")?.value;

  return (
    <>
      {!token ? (
        <div className="flex items-center justify-center">
          <Link
            href={"/login"}
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      ) : (
        <Link
          href={"/mynotes"}
          className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2 px-4 rounded"
        >
          Access my Notes{" "}
        </Link>
      )}
    </>
  );
}
