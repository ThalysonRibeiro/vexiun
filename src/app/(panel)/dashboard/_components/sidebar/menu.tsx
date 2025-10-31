"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, User, LogOut, Loader2, Bell, Users, Mail } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface MenuProps {
  userData: Session;
}

export function Menu({ userData }: MenuProps) {
  const { update } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      await update();
      router.replace("/");
    } catch (error) {
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="bg-accent p-2 h-auto flex items-center justify-between gap-3 rounded-md hover:bg-accent/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userData.user?.image || undefined}
                alt={userData.user?.name || "User"}
              />
              <AvatarFallback className="text-xs">
                {getUserInitials(userData.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium truncate max-w-32">
                {userData.user?.name || "Usuário"}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-32">
                {userData.user?.email}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard/profile" className="flex items-center gap-2">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard/workspace/invites" className="flex items-center w-full gap-2">
            <Mail className="mr-2 h-4 w-4" />
            Convites
            <Badge className="ml-auto">1</Badge>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard/notifications" className="flex items-center gap-2">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer"
          variant="destructive"
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          {isLoggingOut ? "Saindo..." : "Sair"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
