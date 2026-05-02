export default function StatusBadge({ status }) {
  const styles = {
    pending:   { bg: "#FEF3C7", color: "#92400E" },
    confirmed: { bg: "#F5ECD9", color: "#5C3D18" },
    shipped:   { bg: "#EDE9FE", color: "#5B21B6" },
    delivered: { bg: "#D1FAE5", color: "#065F46" },
    cancelled: { bg: "#FEE2E2", color: "#991B1B" },
  };

  const icons = {
    pending: "⏳", confirmed: "✅", shipped: "🚚",
    delivered: "📦", cancelled: "❌",
  };

  const s = styles[status] || styles.pending;

  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontSize: "11px",
      fontWeight: "500",
      padding: "3px 10px",
      borderRadius: "999px",
      whiteSpace: "nowrap",
      textTransform: "capitalize",
    }}>
      {icons[status]} {status}
    </span>
  );
}