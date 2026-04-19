// ✅ Shared styles for: Navbar component

export const navbarStyles = {
  navbar: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    position: "relative",
    zIndex: 5,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "120px",
  },

  brandText: {
    fontWeight: "700",
    color: "#2f7a56",
    fontSize: "16px",
  },

  navCenter: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "25px",
  },

  link: {
    textDecoration: "none",
    color: "#444",
    fontSize: "14px",
    fontWeight: "500",
  },

  navRight: {
    minWidth: "120px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  greenBtn: {
    background: "#2f7a56",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },
};
