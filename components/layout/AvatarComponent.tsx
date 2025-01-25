"use client";

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
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AvatarComponent = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
  } | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/users/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userData) return null;

  const usernameFirstLetter = userData.username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "GET",
      });
      if (response.ok) {
        toast.success("Logged out successfully");
        setUserData(null);
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <DropdownMenu modal={false}>
      <Toaster richColors position="top-center" />
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${userData.username}`}
            alt={userData.username}
          />
          <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Information</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="focus:bg-transparent select-text">
          {userData.username}
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-transparent select-text">
          {userData.email}
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>
          <Button type="submit" className="w-full p-0" onClick={handleLogout}>
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarComponent;
