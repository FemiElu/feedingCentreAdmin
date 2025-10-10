import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export interface AdminUser extends User {
  user_metadata: {
    name?: string;
    center_id?: string;
  };
}

export interface AuthState {
  user: AdminUser | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // If Supabase is not configured, simulate a logged-in state for demo purposes
    if (!supabase) {
      setAuthState({
        user: {
          id: "demo-user",
          email: "admin@church.com",
          user_metadata: {
            name: "Demo Admin",
            center_id: "demo-center",
          },
        } as AdminUser,
        session: null,
        loading: false,
      });
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: (session?.user as AdminUser) || null,
        session,
        loading: false,
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: (session?.user as AdminUser) || null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!supabase) {
      // Demo mode - just clear the state
      setAuthState({
        user: null,
        session: null,
        loading: false,
      });
      return;
    }
    await supabase.auth.signOut();
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      // Demo mode - simulate successful login
      setAuthState({
        user: {
          id: "demo-user",
          email: email,
          user_metadata: {
            name: "Demo Admin",
            center_id: "demo-center",
          },
        } as AdminUser,
        session: null,
        loading: false,
      });
      return { data: { user: null }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
}
