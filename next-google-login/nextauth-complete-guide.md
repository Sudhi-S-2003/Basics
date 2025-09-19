# NextAuth.js Complete Guide & Code

## Table of Contents
1. [Complete Configuration Code](#complete-configuration-code)
2. [Environment Variables](#environment-variables)
3. [Function-by-Function Explanation](#function-by-function-explanation)
4. [Authentication Flow](#authentication-flow)
5. [Usage Examples](#usage-examples)
6. [Troubleshooting](#troubleshooting)

---

## Complete Configuration Code

### `lib/authOptions.js`
```javascript
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
            role: user.role,
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
            role: user.role,
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

    async redirect({ url, baseUrl, token }) {
      // If it's a callback URL, allow it
      if (url.includes('/api/auth/callback')) {
        return url;
      }

      const role = token?.role || "user";

      // Role-based redirection after sign-in
      if (url === baseUrl || url.startsWith(baseUrl + '/auth')) {
        if (role === "admin") {
          return baseUrl + "/admin/dashboard";
        }
        if (role === "manager") {
          return baseUrl + "/manager/home";
        }
        return baseUrl + "/profile";
      }

      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
```

### `app/api/auth/[...nextauth]/route.js`
```javascript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

---

## Environment Variables

### `.env.local`
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string_here_32_chars_min
NEXTAUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/your-database
```

---

## Function-by-Function Explanation

### 1. GoogleProvider Function
**When Called:** User clicks "Sign in with Google"

**Parameters:**
- `clientId`: Google OAuth app ID
- `clientSecret`: Google OAuth app secret
- `authorization.params`: OAuth configuration

**Process:**
1. Redirects to Google OAuth consent screen
2. User grants permissions
3. Google redirects back with authorization code
4. NextAuth exchanges code for user profile
5. Returns user object: `{ id, name, email, image }`

---

### 2. CredentialsProvider.authorize (Email OTP)
**When Called:** User submits email + OTP form

**Parameters Received:**
```javascript
credentials = {
  email: "user@example.com",
  otp: "123456"
}
```

**Process:**
1. Connects to MongoDB
2. Finds user by email
3. Verifies OTP matches stored value
4. Clears OTP from database (security)
5. Returns complete user object or `null`

---

### 3. signIn Callback
**When Called:** Immediately after successful authentication

**Parameters:**
```javascript
{
  user: {
    // User data from provider
  },
  account: {
    provider: "google" | "email-otp" | "phone-otp",
    type: "oauth" | "credentials"
  }
}
```

**Process:**
1. Connects to MongoDB
2. Searches for existing user (email/phone/_id)
3. Creates new user if not found (default role: "user")
4. Updates existing user if Google OAuth
5. Enhances user object with `_id` and `role`
6. Sets httpOnly userId cookie
7. Returns `true` (allow) or `false` (deny)

---

### 4. jwt Callback
**When Called:** 
- During initial sign-in
- On JWT refresh
- When accessing protected routes

**Parameters:**
- Initial: `{ token, user }` (user exists)
- Later: `{ token }` (user is undefined)

**Process:**
1. If user exists (initial sign-in), add data to token
2. Stores MongoDB _id, phone, role in JWT
3. Returns enhanced token

**Token Contains:**
```javascript
{
  id: "mongodb_user_id",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  role: "user",
  image: "profile.jpg"
}
```

---

### 5. session Callback
**When Called:**
- Every `getSession()` call
- Every `useSession()` hook execution
- On page loads for authenticated users

**Parameters:**
```javascript
{
  session: {
    user: { name, email, image },
    expires: "date"
  },
  token: {
    // All data from jwt callback
  }
}
```

**Process:**
1. Extracts user info from JWT token
2. Shapes final session object
3. Adds custom fields (id, phone, role)

**Returns to App:**
```javascript
session = {
  user: {
    id: "mongodb_user_id",
    name: "John Doe",
    email: "john@example.com", 
    phone: "+1234567890",
    role: "user",
    image: "profile.jpg"
  },
  expires: "2024-01-15T10:30:00.000Z"
}
```

---

### 6. redirect Callback
**When Called:** After sign-in/sign-out or when redirection needed

**Parameters:**
```javascript
{
  url: "http://localhost:3000/profile",  // Intended destination
  baseUrl: "http://localhost:3000",      // App base URL
  token: { role: "admin", ... }          // JWT data
}
```

**Process:**
1. Allows OAuth callbacks
2. Role-based redirection:
   - `admin` → `/admin/dashboard`
   - `manager` → `/manager/home`
   - `user` → `/profile`
3. URL validation for security

---

## Authentication Flow

### Complete Google OAuth Flow:
```
1. User clicks "Sign in with Google"
   ↓
2. GoogleProvider redirects to Google
   ↓  
3. User grants permissions
   ↓
4. Google redirects back with code
   ↓
5. signIn callback:
   - Creates/finds user in database
   - Adds _id and role to user object
   - Sets userId cookie
   ↓
6. jwt callback:
   - Stores user info in JWT token
   ↓
7. session callback:
   - Creates session object from token
   ↓
8. redirect callback:
   - Redirects based on user role
   ↓
9. User lands on appropriate dashboard
```

### OTP Authentication Flow:
```
1. User enters email/phone + OTP
   ↓
2. CredentialsProvider.authorize:
   - Validates OTP against database
   - Clears OTP after validation
   - Returns user object
   ↓
3. signIn callback:
   - User already has _id and role
   - Sets userId cookie
   ↓
4. jwt callback:
   - Stores user info in JWT token
   ↓
5. session callback:
   - Creates session object
   ↓
6. redirect callback:
   - Redirects based on role
   ↓
7. User lands on appropriate page
```

### Session Access Flow:
```
1. Component calls useSession()
   ↓
2. session callback runs:
   - Gets data from JWT token
   - Returns session object
   ↓
3. Component receives complete session data
```

---

## Usage Examples

### In React Components:
```javascript
import { useSession, signIn, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Role: {session.user.role}</p>
      <p>Email: {session.user.email}</p>
      <p>Phone: {session.user.phone}</p>
      <p>User ID: {session.user.id}</p>
      
      {session.user.role === "admin" && (
        <p>You have admin privileges!</p>
      )}
      
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Server-Side Usage:
```javascript
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export default async function ServerComponent() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div>Not authenticated</div>;
  }
  
  return (
    <div>
      <h1>Server-side session</h1>
      <p>User: {session.user.name}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

### API Route Protection:
```javascript
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  
  return Response.json({ 
    message: "Admin data",
    user: session.user 
  });
}
```

### Middleware Protection:
```javascript
// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic
    if (req.nextUrl.pathname.startsWith("/admin") && 
        req.nextauth.token?.role !== "admin") {
      return new Response("Forbidden", { status: 403 });
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*", "/manager/:path*"]
};
```

---

## Troubleshooting

### Common Issues & Solutions:

#### 1. Cookie Error in Next.js 15+
**Error:** `cookies() should be awaited before using its value`
**Solution:** Always await cookies()
```javascript
const cookieStore = await cookies();
```

#### 2. JWT Token Size Issues
**Problem:** JWT becomes too large with user data
**Solution:** Store only essential data in JWT
```javascript
async jwt({ token, user }) {
  if (user) {
    token.id = user._id.toString();
    token.role = user.role;
    // Don't store large objects
  }
  return token;
}
```

#### 3. Database Connection Issues
**Problem:** Connection timeouts in callbacks
**Solution:** Implement connection retry
```javascript
async function dbConnectWithRetry(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await dbConnect();
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

#### 4. Role-Based Redirect Loops
**Problem:** Infinite redirects
**Solution:** Improved redirect logic
```javascript
async redirect({ url, baseUrl, token }) {
  // Prevent redirect loops
  if (url.includes('/api/auth/')) return url;
  
  const role = token?.role || "user";
  const targetPath = role === "admin" ? "/admin/dashboard" : "/profile";
  
  // Only redirect if not already on target path
  if (!url.includes(targetPath)) {
    return baseUrl + targetPath;
  }
  
  return url;
}
```

#### 5. Session Not Updating
**Problem:** Session doesn't reflect database changes
**Solution:** Force session update
```javascript
import { useSession } from "next-auth/react";

const { data: session, update } = useSession();

// After database update
await update(); // Triggers fresh session fetch
```

---

## Security Best Practices

1. **Environment Variables:** Never commit secrets to version control
2. **HTTPS:** Always use HTTPS in production
3. **JWT Secret:** Use a strong, random secret (32+ characters)
4. **OTP Expiration:** Implement OTP timeout
5. **Rate Limiting:** Add rate limiting for OTP requests
6. **Input Validation:** Validate all user inputs
7. **CSRF Protection:** NextAuth includes CSRF protection by default

---

## Database Schema Example

```javascript
// User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  image: String,
  role: { type: String, default: "user", enum: ["user", "admin", "manager"] },
  otp: String,
  otpExpiry: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

This complete guide covers everything you need to implement and understand NextAuth with Google OAuth and OTP authentication, including role-based access control and proper security practices.