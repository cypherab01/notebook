import { SignIn } from "@/components/auth/signin-button";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function Home() {
  const token = (await cookies()).get("token")?.value;

  return (
    <div className="flex min-h-96 flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Your Thoughts, Organized.</h1>
      <p className="text-lg mb-8">
        A simple and elegant way to keep track of your notes.
      </p>
      <div className="flex gap-4">
        <SignIn />
        {!token && (
          <Link
            href={"/signup"}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-2 px-4 rounded"
          >
            Sign Up
          </Link>
        )}
      </div>
    </div>
  );
}
