import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  const login = async (email, password, apiLogin) => {
    // apiLogin is a function that calls backend; returns { token, user }
    const result = await apiLogin(email, password);
    setUser(result.user);
    localStorage.setItem('auth_token', result.token || '');
    return result.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
