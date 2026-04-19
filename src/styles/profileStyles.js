// ✅ Styles for: Profile page

export const profileStyles = {
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
    maxWidth: "500px",
    margin: "100px auto",
    background: "rgba(255,255,255,0.93)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
  },

  title: {
    textAlign: "center",
    margin: "0 0 24px 0",
    fontSize: "28px",
    fontWeight: "700",
    color: "#111",
  },

  field: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#333",
  },

  valueBox: {
    minHeight: "46px",
    display: "flex",
    alignItems: "center",
    padding: "0 14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    background: "#fff",
    fontSize: "14px",
    color: "#222",
  },

  input: {
    width: "100%",
    height: "46px",
    padding: "0 14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    background: "#fff",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },

  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "26px",
    flexWrap: "wrap",
  },

  editBtn: {
    background: "#2f7a56",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  saveBtn: {
    background: "#2f7a56",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#d9534f",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
};
