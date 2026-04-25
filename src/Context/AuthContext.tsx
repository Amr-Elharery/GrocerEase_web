import { createContext, useContext, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string, expiry: number) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiry");
    if (!token) return false;
    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiry");
      return false;
    }
    return true;
  });

  const login = (token: string, expiry: number) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expiry", String(expiry));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiry");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}