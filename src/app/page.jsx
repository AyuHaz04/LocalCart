import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FDF8F3" }}>

      {/* Hero */}
      <section style={{
        background: "white",
        borderBottom: "1px solid #E0C9A6",
        padding: "5rem 1.5rem",
        textAlign: "center",
      }}>
        <span style={{
          display: "inline-block",
          background: "#F5ECD9",
          color: "#8B6435",
          fontSize: "12px",
          fontWeight: "500",
          padding: "4px 14px",
          borderRadius: "999px",
          marginBottom: "1.25rem",
          letterSpacing: "0.05em",
        }}>
          Handmade with love, delivered nearby
        </span>

        <h1 style={{
          fontSize: "42px",
          fontWeight: "700",
          color: "#2C1A0E",
          lineHeight: "1.2",
          maxWidth: "600px",
          margin: "0 auto 1rem",
        }}>
          Discover Local Artisans Near You
        </h1>

        <p style={{
          fontSize: "17px",
          color: "#6B4C2A",
          maxWidth: "480px",
          margin: "0 auto 2rem",
          lineHeight: "1.6",
        }}>
          Shop unique handmade crafts from talented creators in your community.
          Support local. Buy local.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/explore" style={{
            background: "#8B6435",
            color: "white",
            padding: "12px 28px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: "500",
          }}>
            Explore Shops
          </Link>
          <Link href="/register" style={{
            background: "#F5ECD9",
            color: "#5C3D18",
            padding: "12px 28px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: "500",
          }}>
            Start Selling
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{
        background: "#FDF8F3",
        padding: "4rem 1.5rem",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.25rem",
        }}>
          {[
            {
              icon: "📍",
              title: "Find Shops Nearby",
              desc: "Discover artisans within your delivery radius on an interactive map.",
            },
            {
              icon: "🛍️",
              title: "Shop Handmade",
              desc: "Browse unique handcrafted products you won't find anywhere else.",
            },
            {
              icon: "💳",
              title: "Pay Securely",
              desc: "Checkout safely with Razorpay. Supports UPI, cards and netbanking.",
            },
          ].map((f) => (
            <div key={f.title} style={{
              background: "white",
              border: "1px solid #E0C9A6",
              borderRadius: "14px",
              padding: "1.75rem 1.5rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "0.75rem" }}>{f.icon}</div>
              <h3 style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#2C1A0E",
                marginBottom: "0.5rem",
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: "13px",
                color: "#9B7B54",
                lineHeight: "1.7",
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}