import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}