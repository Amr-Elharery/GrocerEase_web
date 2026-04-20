export const authService = {
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