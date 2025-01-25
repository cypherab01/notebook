"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      const response = await fetch("/api/users/verifyemail", {
        method: "POST",
        body: JSON.stringify({ token: decodeURIComponent(token) }),
      });
      if (!response.ok) {
        throw new Error("Email verification failed");
      }
      setVerified(true);
      toast.success("Email verified successfully!");
    } catch (error: any) {
      setError(true);
      toast.error(
        "Verification failed. The link may have expired, is invalid, or was already verified."
      );
      console.log(error.message);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    // Ensure we handle URL encoded tokens properly
    setToken(urlToken ? encodeURIComponent(urlToken) : "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center py-4 bg-background">
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!verified && !error && (
            <div className="text-center">
              <p className="text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <p className="text-center text-red-500">
                Verification failed. The link may have expired, is invalid, or
                was already verified.
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          )}

          {verified && (
            <div className="space-y-4">
              <p className="text-center text-green-500">
                Your email has been successfully verified.
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Continue to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
