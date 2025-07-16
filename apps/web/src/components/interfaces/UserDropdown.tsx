import { Database } from "@/types/database";

import { Icons } from "@metrica/ui/components/icons";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@metrica/ui/components/avatar";
import { Button } from "@metrica/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@metrica/ui/components/dropdown-menu";
import { useIsMobile } from "@metrica/ui/hooks/use-mobile";

export function UserDropdown({
  profile,
  children,
}: {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const username = profile.first_name + " " + profile.last_name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="ghost"
          className="p-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {children}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-9 w-9">
              <AvatarImage src={""} alt={username} />
              <AvatarFallback className="bg-amber-400">MD</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{username}</span>
              <span className="truncate text-xs">{profile.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icons.Account />
            Compte
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icons.CreditCard />
            Facturation
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icons.Notifications />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icons.LogOut />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
