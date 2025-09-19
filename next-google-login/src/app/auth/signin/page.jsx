'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);

  const handleEmailOtpRequest = async () => {
    if (!email) return alert("Please enter your email");
    setLoadingEmail(true);
    try {
      const res = await fetch("/api/send-email-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert("OTP sent to email!");
      } else {
        alert("Failed to send OTP to email");
      }
    } catch {
      alert("Error sending OTP");
    }
    setLoadingEmail(false);
  };

  const handlePhoneOtpRequest = async () => {
    if (!phone) return alert("Please enter your phone number");
    setLoadingPhone(true);
    try {
      const res = await fetch("/api/send-phone-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert("OTP sent to phone!");
      } else {
        alert("Failed to send OTP to phone");
      }
    } catch {
      alert("Error sending OTP");
    }
    setLoadingPhone(false);
  };

  const loginWithEmailOtp = () => {
    if (!email || !emailOtp) return alert("Please enter email and OTP");
    signIn("email-otp", { email, otp: emailOtp, redirect: true, callbackUrl: "/" });
  };

  const loginWithPhoneOtp = () => {
    if (!phone || !phoneOtp) return alert("Please enter phone and OTP");
    signIn("phone-otp", { phone, otp: phoneOtp, redirect: true, callbackUrl: "/" });
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Sign In</h1>

      <button style={styles.googleBtn} onClick={() => signIn("google")}>
        Sign in with Google
      </button>

      <div style={styles.separator}>or</div>

      <section style={styles.section}>
        <h2>Email OTP Login</h2>
        <input
          style={styles.input}
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loadingEmail}
        />
        <button style={styles.btn} onClick={handleEmailOtpRequest} disabled={loadingEmail}>
          {loadingEmail ? "Sending..." : "Send OTP to Email"}
        </button>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter OTP"
          value={emailOtp}
          onChange={(e) => setEmailOtp(e.target.value)}
        />
        <button style={styles.btn} onClick={loginWithEmailOtp}>
          Login with Email OTP
        </button>
      </section>

      <section style={styles.section}>
        <h2>Phone OTP Login</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loadingPhone}
        />
        <button style={styles.btn} onClick={handlePhoneOtpRequest} disabled={loadingPhone}>
          {loadingPhone ? "Sending..." : "Send OTP to Phone"}
        </button>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter OTP"
          value={phoneOtp}
          onChange={(e) => setPhoneOtp(e.target.value)}
        />
        <button style={styles.btn} onClick={loginWithPhoneOtp}>
          Login with Phone OTP
        </button>
      </section>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  googleBtn: {
    width: "100%",
    padding: "0.6rem",
    fontSize: "1rem",
    backgroundColor: "#4285F4",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  separator: {
    textAlign: "center",
    margin: "1.5rem 0",
    fontWeight: "bold",
    color: "#999",
  },
  section: {
    marginBottom: "2rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: 6,
  },
  input: {
    width: "100%",
    padding: "0.6rem",
    margin: "0.5rem 0",
    fontSize: "1rem",
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  btn: {
    width: "100%",
    padding: "0.6rem",
    fontSize: "1rem",
    borderRadius: 4,
    border: "none",
    backgroundColor: "#0070f3",
    color: "#fff",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
};
