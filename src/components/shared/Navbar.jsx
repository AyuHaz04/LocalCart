"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav style={{
      background: "white",
      borderBottom: "1px solid #E0C9A6",
      padding: "0 1.5rem",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <Link href="/" style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#8B6435",
        textDecoration: "none",
      }}>
        🧵 LocalCraft
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <Link href="/explore" style={{
          fontSize: "14px",
          color: "#6B4C2A",
          textDecoration: "none",
        }}>
          Explore
        </Link>

        {status === "loading" && (
          <span style={{ fontSize: "13px", color: "#9B7B54" }}>...</span>
        )}

        {status === "unauthenticated" && (
          <>
            <Link href="/login" style={{
              fontSize: "14px",
              color: "#6B4C2A",
              textDecoration: "none",
            }}>
              Log in
            </Link>
            <Link href="/register" style={{
              background: "#8B6435",
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
                color: "#6B4C2A",
                textDecoration: "none",
              }}>
                My Shop
              </Link>
            )}
            {session.user.role === "buyer" && (
              <Link href="/buyer" style={{
                fontSize: "14px",
                color: "#6B4C2A",
                textDecoration: "none",
              }}>
                My Orders
              </Link>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{
                fontSize: "13px",
                color: "#2C1A0E",
                fontWeight: "500",
              }}>
                Hi, {session.user.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  fontSize: "13px",
                  color: "#9B7B54",
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