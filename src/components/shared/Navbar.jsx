"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav style={{
      background: "white",
      borderBottom: "1px solid var(--border)",
      padding: "0 1.5rem",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <Link href="/" style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "var(--earth-600)",
        textDecoration: "none",
        letterSpacing: "-0.3px",
      }}>
        🧵 LocalCraft
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <Link href="/explore" style={{
          fontSize: "14px",
          color: "var(--text-mid)",
          textDecoration: "none",
        }}>
          Explore
        </Link>

        {status === "loading" && (
          <span style={{ fontSize: "13px", color: "var(--text-light)" }}>...</span>
        )}

        {status === "unauthenticated" && (
          <>
            <Link href="/login" style={{
              fontSize: "14px",
              color: "var(--text-mid)",
              textDecoration: "none",
            }}>
              Log in
            </Link>
            <Link href="/register" style={{
              background: "var(--earth-600)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              textDecoration: "none",
              fontWeight: "500",
            }}>
              Sign up
            </Link>
          </>
        )}

        {status === "authenticated" && (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {session.user.role === "seller" && (
              <Link href="/seller" style={{
                fontSize: "14px",
                color: "var(--text-mid)",
                textDecoration: "none",
              }}>
                My Shop
              </Link>
            )}
            {session.user.role === "buyer" && (
              <Link href="/buyer" style={{
                fontSize: "14px",
                color: "var(--text-mid)",
                textDecoration: "none",
              }}>
                My Orders
              </Link>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{
                fontSize: "13px",
                color: "var(--text-dark)",
                fontWeight: "500",
              }}>
                Hi, {session.user.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  fontSize: "13px",
                  color: "var(--text-light)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}