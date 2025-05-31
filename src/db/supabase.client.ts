import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const createSupabaseClient = () => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl) throw new Error("PUBLIC_SUPABASE_URL environment variable is required");
  if (!supabaseAnonKey) throw new Error("PUBLIC_SUPABASE_KEY environment variable is required");

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storage: {
        getItem: (key: string) => {
          if (typeof document === "undefined") return null;
          const value = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${key}=`))
            ?.split("=")[1];
          return value ? decodeURIComponent(value) : null;
        },
        setItem: (key: string, value: string) => {
          if (typeof document === "undefined") return;
          document.cookie = `${key}=${encodeURIComponent(value)}; path=/; secure; samesite=strict`;
        },
        removeItem: (key: string) => {
          if (typeof document === "undefined") return;
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        },
      },
    },
  });
};

export const supabaseClient = createSupabaseClient();
