import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from "../services/api";

const AuthContext = createContext(null);



export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => { localStorage.removeItem('token'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
