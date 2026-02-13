import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log("🛡️ Middleware:", req.nextUrl.pathname)
  },
  {
    pages: {
      signIn: "/auth/login",
    },
    callbacks: {
      authorized: ({ token }) => {
        console.log("🔐 Token:", token)

        if (token) {
          console.log("✅ Logged in as:", token.email)
        } else {
          console.log("❌ Token missing")
        }

        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/home/:path*"],
}
