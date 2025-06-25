"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const LogoutButton = ({
  className,
  variant = "outline",
}: LogoutButtonProps) => {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/signin",
      redirect: true,
    });
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      className={className}
      size='sm'>
      <LogOut className='w-4 h-4 mr-2' />
      Déconnexion
    </Button>
  );
};

export default LogoutButton;
