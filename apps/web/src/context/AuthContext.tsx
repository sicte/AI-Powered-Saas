import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  type User,
  getToken,
  setToken,
  clearToken,
  getMe,
  getDemo,
  signIn as apiSignIn,
  signUp as apiSignUp,
  signOutRequest,
} from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  isDemo: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const token = getToken();
      if (token) {
        const me = await getMe(token).catch(() => ({ authenticated: false, user: undefined }));
        if (cancelled) return;
        if (me.authenticated && me.user) {
          setUser(me.user!);
          setLoading(false);
          return;
        }
        clearToken();
      }

      const demo = await getDemo().catch(() => null);
      if (cancelled) return;
      if (demo) {
        setToken(demo.token);
        setUser(demo.user);
      }
      setLoading(false);
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await apiSignIn(email, password);
    setToken(res.token);
    setUser(res.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const res = await apiSignUp(name, email, password);
    setToken(res.token);
    setUser(res.user);
  };

  const signOut = async () => {
    const token = getToken();
    if (token) {
      await signOutRequest(token).catch(() => undefined);
    }
    clearToken();
    const demo = await getDemo().catch(() => null);
    if (demo) {
      setToken(demo.token);
      setUser(demo.user);
    } else {
      setUser(null);
    }
  };

  const isDemo = !!user?.is_demo;

  return (
    <AuthContext.Provider value={{ user, isDemo, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}