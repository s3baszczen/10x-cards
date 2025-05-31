import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { User } from "lucide-react";

interface UserMenuProps {
  email: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ email }) => {
  const handleLogout = async () => {
    // Will be implemented later
    console.log("Logout clicked");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="text-sm text-gray-500 dark:text-gray-400" disabled>
          {email}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
