import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabaseClient';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveUser = async () => {
      try {
        const {
          data: { user: initialUser },
        } = await supabase.auth.getUser();
        if (isMounted) {
          setUser(initialUser ?? null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    resolveUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
