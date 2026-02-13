import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session }) {
      await connectDB();

      const dbUser = await User.findOne(
        { email: session.user.email },
        { role: 1 }
      );

      session.user.role = dbUser?.role || "user";
      return session;
    },
  },
};
