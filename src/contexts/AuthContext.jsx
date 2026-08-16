import { createContext, useCallback, useContext, useState } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi, getStoredUser } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const toast = useToast();

  const login = useCallback(async (credentials) => {
    const res = await loginApi(credentials);
    setUser(res.user);
    toast.success('خوش آمدید', `به کفشینو خوش آمدید، ${res.user.name || 'کاربر عزیز'}`);
    return res;
  }, [toast]);

  const register = useCallback(async (payload) => {
    const res = await registerApi(payload);
    setUser(res.user);
    toast.success('ثبت‌نام موفق', 'حساب کاربری شما با موفقیت ایجاد شد.');
    return res;
  }, [toast]);

  const logout = useCallback(() => {
    logoutApi();
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => setUser(updated), []);

  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth باید داخل AuthProvider استفاده شود.');
  return ctx;
}
