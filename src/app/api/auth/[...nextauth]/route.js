import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import { upsertUserOnLogin } from "../../../../lib/user.service";

const handler = NextAuth({
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

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * 🔥 THIS IS WHERE PROVIDER PROFILE IS AVAILABLE
     */
    async jwt({ token, user, account, profile, req }) {
      if (account && user?.email) {
        const ip =
          req?.headers?.get("x-forwarded-for") ||
          req?.headers?.get("x-real-ip") ||
          "unknown";

        const userAgent =
          req?.headers?.get("user-agent") || "unknown";

        await upsertUserOnLogin({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          profile,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          email: user.email,
          name: user.name,
          image: user.image,
          ip,
          userAgent,
        });
      }

      if (user) token.user = user;
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
