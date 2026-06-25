import http from "@/shared/http";

export interface LoginResponse {
  user_data: {
    id: string;
    email: string;
    phone: string | null;
    full_name: string | null;
    roles: string[];
  };
  access_token: string;
  refresh_token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await http.post("/auth/login", { email, password });
    return res.data;
  },

  async logout(): Promise<void> {
    await http.post("/auth/logout");
  },

  async changePassword(payload: {
    current_password: string;
    new_password: string;
  }): Promise<void> {
    await http.post("/auth/change-password", payload);
  },

  async refreshToken(): Promise<{ access_token?: string } | string> {
    const res = await http.post("/auth/refresh-token");
    return res.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await http.post("/auth/web/forgot-password", { email });
  },

  async resetPassword(payload: {
    access_token: string;
    refresh_token: string;
    new_password: string;
  }): Promise<void> {
    await http.post("/auth/reset-password", payload);
  },

  async register(
    payload: {
      email: string;
      password: string;
      confirmPassword: string;
      phone: string;
      full_name: string;
    },
    accountType: "admin" | "vendor" = "admin"
  ): Promise<void> {
    const endpoint =
      accountType === "vendor" ? "/auth/vendor/register" : "/auth/admin/register";
    await http.post(endpoint, payload);
  },
};