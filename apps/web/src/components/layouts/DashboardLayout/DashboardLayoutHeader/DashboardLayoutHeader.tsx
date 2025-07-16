"use client";

import Link from "next/link";

import { Database } from "@/types/database";
import { cn } from "@metrica/ui/lib/utils";
import { useDashboardStore } from "@/stores/useDashboardStore";

import { useIsMobile } from "@metrica/ui/hooks/use-mobile";

import MobileNavigationBar from "@/components/layouts/DashboardLayout/NavigationBar/MobileNavigationBar";
import { SearchBar } from "@/components/interfaces/SearchBar";
import { Button } from "@metrica/ui/components/button";
import { Icons } from "@metrica/ui/components/icons";
import { UserDropdown } from "@/components/interfaces/UserDropdown";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@metrica/ui/components/avatar";

const DashboardLayoutHeader = ({ headerTitle }: { headerTitle?: string }) => {
  const profile = useDashboardStore((state) => state.profile);

  return (
    <header
      className={cn(
        "bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 px-4",
      )}
    >
      <MobileNavigationBar />
      <h3 className="text-2xl font-medium hidden sm:block">{headerTitle}</h3>
      <div className="flex items-center gap-4">
        <SearchBar />
        <Button variant="ghost" asChild>
          <Link href="/dashboard/settings">
            <Icons.Settings size={20} />
          </Link>
        </Button>
        {profile && <UserNav profile={profile} />}
      </div>
    </header>
  );
};

const UserNav = ({
  profile,
}: {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
}) => {
  const username = profile.first_name + " " + profile.last_name;

  return (
    <UserDropdown profile={profile}>
      <Avatar className="h-9 w-9">
        <AvatarImage src={""} alt={username} />
        <AvatarFallback className=" bg-amber-400">MD</AvatarFallback>
      </Avatar>
    </UserDropdown>
  );
};

export default DashboardLayoutHeader;
