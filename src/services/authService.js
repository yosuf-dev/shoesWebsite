import api, { isMock, mockDelay, mockReject } from './api';
import { USERS, ORDERS } from '../data/mockData';
import { STORAGE_KEYS } from '../constants/config';
import { nameFromEmail } from '../utils/format';

const { token: TOKEN_KEY, user: USER_KEY } = STORAGE_KEYS;

/** حساب‌های تستی با رمز ثابت برای ورود سریع */
export const DEMO_ACCOUNTS = {
  'admin@kafshino.ir': 'admin123',
  'test@kafshino.ir': 'test1234',
};

export async function login({ email, password }) {
  if (isMock) {
    await mockDelay(600);
    const user = USERS.find(
      (u) => u.email === email && (password.length >= 4 || u.role === 'admin')
    );
    if (!user) {
      return mockReject('ایمیل یا رمز عبور اشتباه است.');
    }
    const demoPass = DEMO_ACCOUNTS[email];
    if (demoPass && password !== demoPass) {
      return mockReject('ایمیل یا رمز عبور اشتباه است.');
    }
    if (user.status === 'banned') {
      return mockReject('حساب کاربری شما مسدود شده است.');
    }
    const token = `mock-token-${user.id}-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  }
  const data = await api.post('/auth/login', { email, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function register({ name, email, phone, password }) {
  if (isMock) {
    await mockDelay(600);
    const exists = USERS.some((u) => u.email === email);
    if (exists) return mockReject('این ایمیل قبلاً ثبت شده است.');
    const user = {
      id: USERS.length + 1,
      name: name || nameFromEmail(email),
      email,
      phone,
      role: 'customer',
      status: 'active',
      joinedAt: new Date().toISOString(),
      city: 'تهران',
      ordersCount: 0,
    };
    const token = `mock-token-${user.id}-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  }
  const data = await api.post('/auth/register', { name, email, phone, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function getMe() {
  if (isMock) {
    await mockDelay(200);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    return user;
  }
  return api.get('/auth/me');
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function updateProfile(data) {
  if (isMock) {
    await mockDelay(400);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    const updated = { ...user, ...data };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return updated;
  }
  return api.put('/auth/profile', data);
}

export async function changePassword(data) {
  if (isMock) {
    await mockDelay(500);
    return { success: true, message: 'رمز عبور با موفقیت تغییر کرد.' };
  }
  return api.put('/auth/password', data);
}

export async function getUserOrders() {
  if (isMock) {
    await mockDelay(400);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    if (!user) return [];
    return ORDERS.filter((o) => o.userId === user.id || user.role === 'admin');
  }
  return api.get('/auth/orders');
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}
