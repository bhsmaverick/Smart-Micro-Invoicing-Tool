import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<any>(null);

  /**
   * Set authentication data after a successful login/register
   */
  const setAuthData = (newToken: string, userData?: any) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
    if (userData) {
      user.value = userData;
    }
  };

  /**
   * Clear authentication data
   */
  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  };

  /**
   * Check if the user is authenticated
   */
  const isAuthenticated = () => {
    return !!token.value;
  };

  return {
    token,
    user,
    setAuthData,
    logout,
    isAuthenticated,
  };
});
