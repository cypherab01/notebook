import { SignIn } from "@/components/auth/signin-button";

export default async function Home() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Your Thoughts, Organized.</h1>
      <p className="text-lg mb-8">
        A simple and elegant way to keep track of your notes.
      </p>
      <SignIn />
    </div>
  );
}
