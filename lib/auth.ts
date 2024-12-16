import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import userService from "@/services/userService";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      const dbUser = await userService.addUser(
        user.id,
        user.name || "",
        user.email || "",
        undefined,
        user.image || ""
      );
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
