import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabaseClient';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveSession = async () => {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error('Failed to resolve session', error.message);
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    resolveSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      },
      sendMagicLink: async (email: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithOtp({ email });

          if (error) {
            const enhancedError = error as any;
            if (!enhancedError.status && enhancedError.message) {
              const statusMatch = enhancedError.message.match(/\b(429|4\d{2}|5\d{2})\b/);
              if (statusMatch) {
                enhancedError.status = parseInt(statusMatch[1], 10);
              }
            }
            throw enhancedError;
          }

          if (!data && !error) {
            const rateLimitError = new Error(
              'Too many requests. Please wait a few minutes before trying again.',
            ) as any;
            rateLimitError.status = 429;
            throw rateLimitError;
          }
        } catch (caughtError: any) {
          if (caughtError && typeof caughtError === 'object') {
            if (
              caughtError.message?.includes('429') ||
              caughtError.message?.includes('Too Many Requests') ||
              caughtError.status === 429
            ) {
              const rateLimitError = new Error(
                'Too many requests. Please wait a few minutes before trying again.',
              ) as any;
              rateLimitError.status = 429;
              throw rateLimitError;
            }
          }
          throw caughtError;
        }
      },
    }),
    [user, session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
