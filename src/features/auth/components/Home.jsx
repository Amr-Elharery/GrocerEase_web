import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { authService } from "@/features/auth/api/authService";
import Navbar from "@/components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) navigate("/");
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="app" onLogout={handleLogout} />

      
    </div>
  );
}
