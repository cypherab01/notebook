import connect from "@/lib/db";
import User from "@/lib/models/user";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === "google") {
        const { email, name, image: imageurl } = user;
        await connect();
        const userExists = await User.findOne({ email });

        if (!userExists) {
          const res: any = await fetch("http://localhost:3000/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, name, imageurl }),
          });

          if (res.status === 201) {
            return user;
          }
        }

        return user;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
