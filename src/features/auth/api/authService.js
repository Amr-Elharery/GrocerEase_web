import http from '../../../shared/http/httpService';

function validateLoginInput({ email, password }) {
  if (!email || !password) throw new Error('All fields are required');

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) throw new Error('Invalid email format');

  if (password.length < 6) throw new Error('Password must be at least 6 characters');
}

function validateRegisterInput({ name, email, password }) {
  if (!name || !email || !password) throw new Error('All fields are required');

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) throw new Error('Invalid email format');

  if (password.length < 6) throw new Error('Password must be at least 6 characters');
}

export const authService = {
  async login(payload) {
  validateLoginInput(payload);
  localStorage.setItem('token', 'fake-token');
  localStorage.setItem('expiry', Date.now() + 5 * 60 * 1000);
  return { token: 'fake-token' };
},
  // async login(payload) {
  //   validateLoginInput(payload);
  //   const res = await http.post('/auth/login', payload);

  //   const expiryTime = Date.now() + 5 * 60 * 1000;
  //   localStorage.setItem('token', res.data.token);
  //   localStorage.setItem('expiry', expiryTime);

  //   return res.data;
  // },

  async register(payload) {
    validateRegisterInput(payload);
    const res = await http.post('/auth/register', payload);
    return res.data;
  },

  async forgotPassword(email) {
    if (!email) throw new Error('Email is required');
    const res = await http.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword({ token, newPassword, confirmPassword }) {
    if (!newPassword || !confirmPassword) throw new Error('All fields are required');
    if (newPassword.length < 6) throw new Error('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) throw new Error('Passwords do not match');

    const res = await http.post(`/auth/reset-password/${token}`, { newPassword });
    return res.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    if (!token) return false;
    if (expiry && Date.now() > Number(expiry)) {
      this.logout();
      return false;
    }
    return true;
  },
};
