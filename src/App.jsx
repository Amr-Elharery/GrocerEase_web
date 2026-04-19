import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./features/auth/components/Login";
import Home from "./features/auth/components/Home";
import ForgotPassword from "./features/auth/components/ForgotPassword";
import ResetPassword from "./features/auth/components/ResetPassword";
import Profile from "./features/profile/components/Profile";

import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
