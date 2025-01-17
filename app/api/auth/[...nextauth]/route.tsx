import connect from "@/lib/db";
import User from "@/lib/models/user";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

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
        const { email, name, image } = user;
        await connect();
        const userExists = await User.findOne({ email });

        if (!userExists) {
          const res: any = await fetch("http://localhost:3000/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, name, image }),
          });

          if (res.status === 201) {
            return user;
          }
        } else {
          if (userExists.name !== name || userExists.image !== image) {
            userExists.name = name;
            userExists.image = image;
            await userExists.save();
          }
        }

        return user;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
