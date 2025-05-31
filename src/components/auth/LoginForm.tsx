import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { supabaseClient } from "../../db/supabase.client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      console.log("🔑 Attempting login...");
      const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("❌ Login error:", error);
        toast.error("Login failed", {
          description:
            error.message === "Invalid login credentials"
              ? "Incorrect email or password"
              : "Login failed. Please try again",
        });
        return;
      }

      console.log("✅ Login response:", {
        session: authData.session ? "Present" : "Missing",
        user: authData.user ? "Present" : "Missing",
      });

      if (authData.session) {
        // Set session cookies manually to ensure they're available immediately
        const accessToken = authData.session.access_token;
        const refreshToken = authData.session.refresh_token;

        console.log("🔑 Setting auth cookies:", {
          accessToken: accessToken ? `${accessToken.slice(0, 5)}...${accessToken.slice(-5)}` : "Missing",
          refreshToken: refreshToken ? `${refreshToken.slice(0, 5)}...${refreshToken.slice(-5)}` : "Missing",
        });

        // Set cookies using the same names that Supabase client expects
        document.cookie = `access_token=${accessToken}; path=/; secure; samesite=strict`;
        document.cookie = `refresh_token=${refreshToken}; path=/; secure; samesite=strict`;

        // Ensure the client-side Supabase instance has the session
        await supabaseClient.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        // Get redirect path from cookie
        const redirectCookie = document.cookie.split("; ").find((c) => c.trim().startsWith("redirectTo="));
        const redirectPath = redirectCookie ? decodeURIComponent(redirectCookie.split("=")[1]) : "/flashcards";

        console.log("🚀 Redirecting to:", redirectPath);
        window.location.href = redirectPath;
      } else {
        console.error("❌ No session in auth response");
        toast.error("Login issue", {
          description: "No session received. Please try again.",
        });
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("Connection error", {
        description: "Connection problem. Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
