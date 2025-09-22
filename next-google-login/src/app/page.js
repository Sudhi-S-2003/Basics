"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [method, setMethod] = useState("google");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (method === "google") {
      await signIn("google");
    }

    if (method === "magic-link") {
      if (!email) return alert("Enter your email");
      setLoading(true);
      const res = await signIn("email", { email, redirect: false, });
      setLoading(false);
      res?.ok ? alert("Check your email!") : alert("Failed to send link");
    }

    if (method === "email-otp") {
      if (!email || !emailOtp) return alert("Email and OTP required");
      const res = await signIn("email-otp", { email, otp: emailOtp, redirect: false });
      res?.ok ? (window.location.href = "/") : alert("Login failed");
    }

    if (method === "phone-otp") {
      if (!phone || !phoneOtp) return alert("Phone and OTP required");
      const res = await signIn("phone-otp", { phone, otp: phoneOtp, redirect: false });
      res?.ok ? (window.location.href = "/") : alert("Login failed");
    }
  };

  const sendOtp = async () => {
    if (method === "email-otp") {
      if (!email) return alert("Enter email");
      setLoading(true);
      await fetch("/api/send-email-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);
      alert("OTP sent to email");
    }

    if (method === "phone-otp") {
      if (!phone) return alert("Enter phone");
      setLoading(true);
      await fetch("/api/send-phone-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);
      alert("OTP sent to phone");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign In</h2>

      {/* Select login method */}
      <select
        style={styles.select}
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="google">Google</option>
        <option value="magic-link">Email (Magic Link)</option>
        <option value="email-otp">Email OTP</option>
        <option value="phone-otp">Phone OTP</option>
      </select>

      {/* Google Sign-In */}
      {method === "google" && (
        <button style={styles.btn} onClick={login}>
          Continue with Google
        </button>
      )}

      {/* Magic Link */}
      {method === "magic-link" && (
        <>
          <input
            style={styles.input}
            placeholder="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button style={styles.btn} onClick={login} disabled={loading}>
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </>
      )}

      {/* Email OTP */}
      {method === "email-otp" && (
        <>
          <input
            style={styles.input}
            placeholder="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button style={styles.btn} onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
          <input
            style={styles.input}
            placeholder="Enter OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
          />
          <button style={styles.btn} onClick={login}>
            Login
          </button>
        </>
      )}

      {/* Phone OTP */}
      {method === "phone-otp" && (
        <>
          <input
            style={styles.input}
            placeholder="Your phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button style={styles.btn} onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
          <input
            style={styles.input}
            placeholder="Enter OTP"
            value={phoneOtp}
            onChange={(e) => setPhoneOtp(e.target.value)}
          />
          <button style={styles.btn} onClick={login}>
            Login
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #eee",
    borderRadius: "10px",
    fontFamily: "sans-serif",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    marginBottom: "1.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  btn: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "1rem",
  },
};
