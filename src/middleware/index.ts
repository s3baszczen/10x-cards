import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";

// Protected routes that require authentication
const protectedRoutes = ["/flashcards", "/generate"];

// Create a server-side Supabase client
const createServerSupabaseClient = () => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl) throw new Error("PUBLIC_SUPABASE_URL environment variable is required");
  if (!supabaseAnonKey) throw new Error("PUBLIC_SUPABASE_KEY environment variable is required");

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

const supabaseServer = createServerSupabaseClient();

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = supabaseServer;

  const { pathname } = new URL(context.request.url);
  console.log("🛣️ Processing request for:", pathname);

  // Check if the route needs authentication
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    console.log("🔒 Checking auth for protected route:", pathname);

    // Get session from cookies first
    const authCookie = context.cookies.get("access_token")?.value;
    const refreshCookie = context.cookies.get("refresh_token")?.value;
    console.log("🍪 Auth cookies:", {
      accessToken: authCookie ? `${authCookie.slice(0, 5)}...${authCookie.slice(-5)}` : "Missing",
      refreshToken: refreshCookie ? `${refreshCookie.slice(0, 5)}...${refreshCookie.slice(-5)}` : "Missing",
    });

    // If we have a cookie, set it in the client
    if (authCookie) {
      try {
        console.log("🔄 Attempting to set session with tokens");
        const sessionResult = await supabaseServer.auth.setSession({
          access_token: authCookie,
          refresh_token: refreshCookie || "",
        });
        console.log("🔄 Set session result:", {
          success: !!sessionResult.data.session,
          error: sessionResult.error?.message || null,
        });
      } catch (error) {
        console.error("❌ Error setting session:", error);
      }
    }

    const {
      data: { session },
      error,
    } = await supabaseServer.auth.getSession();

    if (error) {
      console.error("❌ Error getting session:", error);
    }

    console.log("🔍 Session check result:", {
      hasSession: !!session,
      userId: session?.user?.id || "none",
      accessToken: session?.access_token ? "Present" : "Missing",
      error: error ? error.message : null,
    });

    if (!session) {
      console.log("⚠️ No session found");

      // For API routes, return JSON error instead of redirecting
      if (pathname.startsWith("/api/")) {
        return new Response(
          JSON.stringify({
            error: "Unauthorized",
            message: "Session expired or invalid",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // For regular routes, redirect to login
      console.log("⚠️ Redirecting to login");
      context.cookies.set("redirectTo", pathname, {
        path: "/",
        secure: true,
        sameSite: "strict",
      });
      return context.redirect("/auth/login");
    }

    console.log("✅ Session valid, proceeding to route");
  } else {
    console.log("🔓 Non-protected route, proceeding");
  }

  return next();
});
