import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getProfile, login as loginRequest } from '@/lib/api/auth';
import { setAuthToken } from '@/lib/api-client';
import { AuthUser } from '@/lib/api-types';
import { deleteToken, getToken, setToken } from '@/lib/token-storage';

const ACCESS_TOKEN_KEY = 'atom.accessToken';

interface SessionContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedToken = await getToken(ACCESS_TOKEN_KEY);
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch {
          await deleteToken(ACCESS_TOKEN_KEY);
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    const { tokens, user: loggedInUser } = await loginRequest(username, password);
    await setToken(ACCESS_TOKEN_KEY, tokens.access.token);
    setAuthToken(tokens.access.token);
    setUser(loggedInUser);
  }, []);

  const signOut = useCallback(async () => {
    await deleteToken(ACCESS_TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, signIn, signOut }),
    [user, isLoading, signIn, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within a SessionProvider');
  return context;
}
