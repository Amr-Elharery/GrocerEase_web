// Shared styles for: Login, ForgotPassword, ResetPassword

export const authStyles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  bg: {
    position: "absolute",
    inset: 0,
    background:
      "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(255,255,255,0.52)",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.93)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
    margin: "120px auto",
  },

  // Login has wider card
  cardWide: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "520px",
    background: "rgba(255,255,255,0.93)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
  },

  title: {
    margin: 0,
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: "10px",
    marginBottom: "22px",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    height: "46px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    padding: "0 14px",
    fontSize: "14px",
    background: "#fff",
    outline: "none",
  },

  button: {
    height: "46px",
    border: "none",
    borderRadius: "12px",
    background: "#2f7a56",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },

  message: {
    marginTop: "16px",
    color: "#2f7a56",
    textAlign: "center",
    fontWeight: "600",
  },

  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#222",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};
