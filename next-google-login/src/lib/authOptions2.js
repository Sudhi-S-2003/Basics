// lib/authOptions.js
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import { User } from "./user";
import { cookies } from "next/headers";

export const authOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Email OTP Credentials Provider
    CredentialsProvider({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const { email, otp } = credentials;
        await dbConnect();

        let user = await User.findOne({ email });

        if (!user) {
          // If user not found, create new user with this email
          user = await User.create({ email });
        }

        if (user.otp !== otp) return null;

        // OTP matched, clear OTP field
        user.otp = null;
        await user.save();

        return user;
      },
    }),

    // Phone OTP Credentials Provider
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const { phone, otp } = credentials;
        await dbConnect();

        const user = await User.findOne({ phone });

        if (!user) return null; // User not found, deny login

        if (user.otp !== otp) return null;

        // OTP matched, clear OTP field
        user.otp = null;
        await user.save();

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt", // use JWT for sessions
  },

  callbacks: {
    async signIn({ user }) {
      // No auto creation here, done in authorize methods
      return true;
    },

    async jwt({ token, user }) {
      // On first sign in, attach MongoDB _id to token
      if (user) {
        token.id = user._id.toString();
      }
      return token;
    },

    async session({ session, token }) {
      await dbConnect();

      const dbUser = await User.findById(token.id);

      if (!dbUser) {
        // User deleted or not found
        session.user = null;
        return session;
      }

      session.user.id = dbUser._id.toString();
      session.user.email = dbUser.email || null;
      session.user.phone = dbUser.phone || null;
      session.user.name = dbUser.name || null;
      session.user.image = dbUser.image || null;

      // Set secure httpOnly cookie with user id
      const cookieStore = cookies();
      cookieStore.set("userId", dbUser._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin", // custom sign-in page route
  },
};
