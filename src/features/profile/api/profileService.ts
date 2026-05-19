export const profileService = {
  async getProfile() {
    return {
      name: "Raghd Ahmed",
      email: "raghd@zad.com",
      phone: "01000000000"
    };
  },

  async updateProfile(payload: { name: string; phone: string }) {
    return { ...payload, email: "raghd@zad.com" };
  },
};