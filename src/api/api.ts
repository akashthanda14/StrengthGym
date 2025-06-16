// src/api/api.ts
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  token: string;
  role: 'admin' | 'client';
  name: string;
  email: string;
}

export const loginUser = async (
  data: LoginPayload,
  isAdmin: boolean
): Promise<AuthResponse> => {
  const endpoint = isAdmin
    ? 'https://strengthgymbackend.onrender.com/api/auth/login'
    : 'https://strengthgymbackend.onrender.com/api/auth/login';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Login failed');

  return res.json();
};

export const registerUser = async (
  data: RegisterPayload
): Promise<AuthResponse> => {
  const res = await fetch('https://strengthgymbackend.onrender.com/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Registration failed');

  return res.json();
};
