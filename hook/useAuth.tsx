"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Helper function to check user role
  const checkUserRole = useCallback((user: User) => {
    console.log("Checking user role for user:", user.id);
    return user.user_metadata?.role === "admin" ? "admin" : "user";
  }, []);

  // Redirect user based on role
  const redirectBasedOnRole = useCallback(
    (role: string) => {
      if (role === "admin") {
        console.log("User is admin, redirecting to /admin");
        router.replace("/admin");
      } else {
        console.log("User is not admin, redirecting to /materials");
        router.replace("/materials");
      }
    },
    [router]
  );

  // Clears session & redirects to login page
  const clearSession = useCallback(async () => {
    console.log("Clearing session...");
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.replace("/auth");
  }, [router, supabase.auth]);

  // Fetch session details
  const getSession = useCallback(async () => {
    console.log("Fetching session...");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session) {
        console.log("Session retrieved:", data.session);
        setSession(data.session);
        setUser(data.session.user);

        const role = checkUserRole(data.session.user);
        redirectBasedOnRole(role);
      } else {
        console.log("No active session found, clearing session.");
        await clearSession();
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      await clearSession();
    } finally {
      setLoading(false);
    }
  }, [checkUserRole, redirectBasedOnRole, clearSession, supabase.auth]);

  useEffect(() => {
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      if (_event === "SIGNED_OUT") {
        clearSession();
      } else if (session) {
        setSession(session);
        setUser(session.user);
        const role = checkUserRole(session.user);
        redirectBasedOnRole(role);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [clearSession, checkUserRole, redirectBasedOnRole, getSession]);

  // Sign out function
  const signOut = useCallback(async () => {
    console.log("Signing out...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      await clearSession();
      console.log("Sign out completed, redirected to /auth");
    }
  }, [clearSession, supabase.auth]);

  return { user, session, loading, signOut, getSession };
}
