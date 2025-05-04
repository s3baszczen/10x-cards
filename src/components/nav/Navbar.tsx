import React from 'react';
import { Button } from '../ui/button';
import UserMenu from './UserMenu';

interface NavbarProps {
  isAuthenticated?: boolean;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false, userEmail }) => {
  return (
    <nav className="border-b dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
              10x Cards
            </a>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && userEmail ? (
              <UserMenu email={userEmail} />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <a href="/auth/login">Sign in</a>
                </Button>
                <Button asChild>
                  <a href="/auth/register">Sign up</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
