// [...nextauth].js or authOptions.js

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import { User } from "./user";
import { cookies } from "next/headers";

export const authOptions = {
  providers: [
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

    CredentialsProvider({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { email, otp } = credentials;
          await dbConnect();

          const user = await User.findOne({ email });
          if (!user || user.otp !== otp) return null;

          user.otp = null;
          await user.save();

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
            role: user.role, // pass role here
            _id: user._id,
          };
        } catch (error) {
          console.error("Email OTP authorization error:", error);
          return null;
        }
      },
    }),

    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { phone, otp } = credentials;
          await dbConnect();

          const user = await User.findOne({ phone });
          if (!user || user.otp !== otp) return null;

          user.otp = null;
          await user.save();

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
            role: user.role, // pass role here
            _id: user._id,
          };
        } catch (error) {
          console.error("Phone OTP authorization error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        await dbConnect();

        const existingUser = await User.findOne({
          $or: [
            { email: user.email },
            { phone: user.phone },
            { _id: user._id },
          ].filter(Boolean),
        });

        if (!existingUser) {
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            phone: user.phone ?? null,
            role: "user", // default role for new users
          });
          user._id = newUser._id;
          user.role = newUser.role;
        } else {
          if (account?.provider === "google") {
            existingUser.name = user.name || existingUser.name;
            existingUser.image = user.image || existingUser.image;
            await existingUser.save();
          }
          user._id = existingUser._id;
          user.role = existingUser.role;
        }

        // Set HTTP-only cookie for userId (FIXED: await cookies())
        try {
          const cookieStore = await cookies();
          cookieStore.set("userId", user._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        } catch (cookieError) {
          // Cookie setting is optional, don't fail auth if it doesn't work
          console.warn("Failed to set userId cookie:", cookieError);
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user._id.toString();
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.image = user.image;
        token.role = user.role || "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.image = token.image;
        session.user.role = token.role;
      }
      return session;
    },

    // This is where you redirect based on role
    async redirect({ url, baseUrl, token }) {
      // If it's a callback URL (contains callback in the path), allow it
      if (url.includes('/api/auth/callback')) {
        return url;
      }

      const role = token?.role || "user";

      // Only redirect after successful sign-in, not on every auth action
      if (url === baseUrl || url.startsWith(baseUrl + '/auth')) {
        if (role === "admin") {
          return baseUrl + "/admin/dashboard";
        }
        if (role === "manager") {
          return baseUrl + "/manager/home";
        }
        return baseUrl + "/profile"; // default
      }

      // For all other cases, return the original URL
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Add secret for production
  secret: process.env.NEXTAUTH_SECRET,
};