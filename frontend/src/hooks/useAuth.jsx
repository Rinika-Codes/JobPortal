import { useState, useEffect, createContext, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getUser());
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (authService.isAuthenticated()) {
        try {
          const data = await authService.getMe();
          setUser(data.user);
          setProfile(data.profile);
          authService.setSession(authService.getToken(), data.user);
        } catch {
          authService.logout();
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    authService.setSession(data.token, data.user);
    setUser(data.user);
    // Fetch full profile
    try {
      const me = await authService.getMe();
      setProfile(me.profile);
    } catch {}
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    authService.setSession(data.token, data.user);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    try {
      const data = await authService.getMe();
      setProfile(data.profile);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default useAuth;
