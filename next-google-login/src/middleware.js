import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // If no token, redirect to login
      return !!token;
    },
  },
  pages: {
    signIn: '/auth/signin', // 👈 this is needed for redirect
  },
});

// Protect `/profile` and `/dashboard` routes, for example:
export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*"],
};

// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// export async function middleware(req) {
//   const token = await getToken({ req });

//   if (!token) {
//     const loginUrl = new URL("/auth/signin", req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/profile/:path*", "/dashboard/:path*"], // Adjust as needed
// };



// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   callbacks: {
//     authorized: ({ token, req }) => {
//       if (!token) return false; // no token = no access

//       const { pathname } = req.nextUrl;

//       // Everyone logged in can access /profile
//       if (pathname.startsWith("/profile")) {
//         return true;
//       }

//       // Only admin role can access /dashboard
//       if (pathname.startsWith("/dashboard")) {
//         return token.role === "admin";
//       }

//       // Default deny
//       return false;
//     },
//   },
// });

// export const config = {
//   matcher: ["/profile/:path*", "/dashboard/:path*"],
// };
