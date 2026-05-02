"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/login?registered=true");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FDF8F3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}>
      <div style={{
        background: "white",
        border: "1px solid #E0C9A6",
        borderRadius: "16px",
        padding: "2rem",
        width: "100%",
        maxWidth: "420px",
      }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#2C1A0E" }}>
            Create an account
          </h1>
          <p style={{ fontSize: "14px", color: "#9B7B54", marginTop: "4px" }}>
            Join LocalCraft and support local artisans
          </p>
        </div>

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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              style={{ width: "100%", padding: "10px 12px", fontSize: "14px" }}
            />
          </div>

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
              placeholder="Min. 6 characters"
              required
              style={{ width: "100%", padding: "10px 12px", fontSize: "14px" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
              I want to
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px 12px", fontSize: "14px" }}
            >
              <option value="buyer">Buy products (Buyer)</option>
              <option value="seller">Sell my crafts (Seller)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#E8D5B5" : "#8B6435",
              color: loading ? "#9B7B54" : "white",
              border: "none",
              borderRadius: "8px",
              padding: "11px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ fontSize: "13px", color: "var(--text-light)", textAlign: "center", marginTop: "1.25rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--earth-600)", textDecoration: "none", fontWeight: "500" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}