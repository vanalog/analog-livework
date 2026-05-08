"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AnalogUser {
  sub: string;
  name: string;
  email: string;
  preferred_workspace?: {
    uuid: string;
    name: string;
  };
}

function mapSupabaseUserToAnalogUser(user: User): AnalogUser {
  // Extract name from user metadata or email
  const name = user.user_metadata?.full_name || 
               user.user_metadata?.name || 
               user.email?.split("@")[0] || 
               "User";
  
  return {
    sub: user.id,
    name,
    email: user.email || "",
    preferred_workspace: {
      uuid: "workspace-1",
      name: "University Athletics",
    },
  };
}

export function useUser(): {
  user?: AnalogUser;
  error?: Error;
  isLoading: boolean;
} {
  const [user, setUser] = useState<AnalogUser | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      try {
        const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          setError(new Error(authError.message));
          setUser(undefined);
        } else if (supabaseUser) {
          setUser(mapSupabaseUserToAnalogUser(supabaseUser));
        } else {
          setUser(undefined);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch user"));
      } finally {
        setIsLoading(false);
      }
    }

    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUserToAnalogUser(session.user));
      } else {
        setUser(undefined);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    error,
    isLoading,
  };
}
