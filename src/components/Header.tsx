import React from "react";
import { Button } from "./ui/button";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_KEY);

const Header = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <Button variant="outline" onClick={handleLogout}>
          Wyloguj się
        </Button>
      </div>
    </header>
  );
};

export default Header;
