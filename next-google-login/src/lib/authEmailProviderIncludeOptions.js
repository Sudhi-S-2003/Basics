import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import { User } from "./user";
import { cookies } from "next/headers";
import { adapter } from "./mongoAdapter";

export const authOptions = {
    adapter,
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

        // Email Magic Link Provider
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
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
                    user = await User.create({ email });
                }

                if (user.otp !== otp) return null;

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

                if (!user) return null;

                if (user.otp !== otp) return null;

                user.otp = null;
                await user.save();

                return user;
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log({ user, account, profile, email, credentials, part: "signin-cb" })
            return true;
        },

        async jwt({ token, user }) {
            console.log({ token, user: "jwt-cb" })
            if (user) {
                token.id = user._id?.toString?.() || user.id || null;
            }
            return token;
        },

        async session({ session, token }) {
            console.log({ session, token: "session-cb" })

            await dbConnect();

            const dbUser = await User.findById(token.id);

            if (!dbUser) {
                session.user = null;
                return session;
            }

            session.user.id = dbUser._id.toString();
            session.user.email = dbUser.email || null;
            session.user.phone = dbUser.phone || null;
            session.user.name = dbUser.name || null;
            session.user.image = dbUser.image || null;

            const cookieStore = await cookies();
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
        signIn: "/auth/signin",
    },
};
