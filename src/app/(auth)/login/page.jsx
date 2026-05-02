"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--earth-50)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "2rem",
        width: "100%",
        maxWidth: "420px",
      }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "var(--text-dark)" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-light)", marginTop: "4px" }}>
            Sign in to your LocalCraft account
          </p>
        </div>

        {registered && (
          <div style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            color: "#166534",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            marginBottom: "1rem",
          }}>
            Account created! Please log in.
          </div>
        )}

        {error && (
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            marginBottom: "1rem",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={{ width: "100%", padding: "10px 12px", fontSize: "14px" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              required
              style={{ width: "100%", padding: "10px 12px", fontSize: "14px" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "var(--earth-200)" : "var(--earth-600)",
              color: loading ? "var(--text-light)" : "white",
              border: "none",
              borderRadius: "8px",
              padding: "11px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p style={{ fontSize: "13px", color: "var(--text-light)", textAlign: "center", marginTop: "1.25rem" }}>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "var(--earth-600)", textDecoration: "none", fontWeight: "500" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}