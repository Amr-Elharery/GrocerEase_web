import http from "@/shared/http";

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  roles: string[];
}

export interface UpdateProfilePayload {
  full_name: string;
  phone: string;
}

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const res = await http.get("/auth/me");
    return res.data;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const res = await http.put("/auth/profile", payload);
    return res.data;
  },
};