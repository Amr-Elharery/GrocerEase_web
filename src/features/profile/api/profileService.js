import http from '../../../shared/http/httpService';

function validateProfileInput({ name, phone }) {
  if (!name || !phone) throw new Error('Name and phone are required');
}

export const profileService = {
  async getProfile() {
    return {
      name: "Raghd Ahmed",
      email: "raghd@zad.com",
      phone: "01000000000"
    };
  },
  // async getProfile() {
  //   const res = await http.get('/profile');
  //   return res.data;
  // },

  async updateProfile(payload) {
    validateProfileInput(payload);
    return { ...payload, email: "raghd@zad.com" }; // fake success
  },
  // async updateProfile(payload) {
  //   validateProfileInput(payload);
  //   const res = await http.put('/profile', payload);
  //   localStorage.setItem('user', JSON.stringify(res.data));
  //   return res.data;
  // },
};