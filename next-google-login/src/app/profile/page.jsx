"use client";

import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    );

  if (!session)
    return (
      <div className="center">
        <p>Access Denied. Please sign in.</p>
      </div>
    );

  return (
    <main className="container">
      <h1>Profile Detail</h1>

      <div className="profile-card">
        <img
          src={session.user.image || "/default-avatar.png"}
          alt="User Avatar"
          className="avatar"
        />
        <div className="info">
          <p>
            <strong>User ID:</strong> {session.user.id}
          </p>
          <p>
            <strong>Email:</strong> {session.user.email || "No email"}
          </p>
          <p>
            <strong>Phone:</strong> {session.user.phone || "No phone"}
          </p>
        </div>
      </div>

      <button className="logout-btn" onClick={() => signOut({ callbackUrl: "/" })}>
        Logout
      </button>

      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 40px auto;
          padding: 24px;
          background: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
        }

        h1 {
          margin-bottom: 24px;
          color: #333;
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          background: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
        }

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #0070f3;
        }

        .info p {
          margin: 6px 0;
          font-size: 16px;
          color: #555;
          text-align: left;
        }

        .logout-btn {
          padding: 12px 30px;
          background-color: #0070f3;
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .logout-btn:hover {
          background-color: #005bb5;
        }

        .center {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60vh;
          font-size: 18px;
          color: #666;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
      `}</style>
    </main>
  );
}
