"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster, toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/signup`,
        {
          method: "POST",
          body: JSON.stringify({ username, email, password }),
        }
      );
      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setTimeout(() => {
          router.push(data.emailProvider);
        }, 2000);
      }
    } catch (error) {
      toast.error("An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="bg-background">
      <Toaster richColors position="top-center" />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <h1 className="flex items-center mb-6 text-2xl font-semibold text-foreground">
          Notebook
        </h1>
        <div className="w-full rounded-lg border bg-card text-card-foreground shadow-sm md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl">
              Sign up to your account
            </h1>
            <form
              method="POST"
              className="space-y-4 md:space-y-6"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-foreground"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="yourcoolname"
                  className="bg-background border border-input text-foreground rounded-lg focus:ring-ring focus:border-ring block w-full p-2.5"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-foreground"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-background border border-input text-foreground rounded-lg focus:ring-ring focus:border-ring block w-full p-2.5"
                  placeholder="yourcoolname@hotmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-background border border-input text-foreground rounded-lg focus:ring-ring focus:border-ring block w-full p-2.5"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-ring font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </button>
              <p className="text-sm font-light text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
