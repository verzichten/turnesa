import Cookies from 'js-cookie';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'PROFESSIONAL' | 'CLIENT';
  tenantId: string;
};

const TOKEN_KEY = 'turnesa_token';
const USER_KEY = 'turnesa_user';

export const auth = {
  setSession(token: string, user: User) {
    // Save token in cookie for SSR and proxy.ts
    Cookies.set(TOKEN_KEY, token, { expires: 7, path: '/' });
    // Save user info in localStorage for client-side use
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr || userStr === 'undefined') return null;
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  logout() {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    localStorage.removeItem(USER_KEY);
    window.location.href = '/iniciar-sesion';
  }
};
