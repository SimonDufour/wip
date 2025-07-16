"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useDashboardStore } from "@/stores/useDashboardStore";

import { cn } from "@metrica/ui/lib/utils";

import { RegularProjectDropdown } from "@/components/interfaces/Dashboard/ProjectDropdown";
import { CreateProjectButton } from "@/components/interfaces/Dashboard/CreateProjectButton";
import { Icons, IconType } from "@metrica/ui/components/icons";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@metrica/ui/components/sidebar";
import { Separator } from "@metrica/ui/components/separator";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const MainNavItems = [
    {
      title: "Projets",
      url: "/dashboard/projects",
      icon: Icons.File,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Icons.Notifications,
    },
    {
      title: "Corbeille",
      url: "/dashboard/trash",
      icon: Icons.Delete,
    },
  ];

  const FooterNavItems = [
    { title: "Soutien", url: "/support", icon: Icons.Info },
    { title: "Commentaires", url: "/feedback", icon: Icons.Send },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar ">
              <div className="flex items-center gap-3 text-primary font-bold">
                <Icons.Logo size={30} />
                <span className="text-2xl">Metrica</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarHeader>
        <NavMain items={MainNavItems} />
      </SidebarHeader>
      <Separator className="my-2" />
      <SidebarContent>
        <NavProjects />
      </SidebarContent>
      <Separator className="my-2" />
      <SidebarFooter>
        <NavSecondary items={FooterNavItems} />
      </SidebarFooter>
    </Sidebar>
  );
}

const NavMain = ({
  items,
}: {
  items: { title: string; url: string; icon: IconType }[];
}) => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={cn(
                "py-5",
                item.url === pathname
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary font-medium"
                  : "",
              )}
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem className="pt-4">
          <CreateProjectButton className="w-full py-5" />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export function NavProjects() {
  const projects = useDashboardStore((state) => state.projects);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-muted-foreground text-sm">
        Récents
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.id} className="">
            <SidebarMenuButton asChild className="py-5">
              <div className="flex items-center justify-between max-w-60">
                <Link href={`/project/${project.id}`} className="grow truncate">
                  {project.title}
                </Link>
                <RegularProjectDropdown
                  project={project}
                  orientation="horizontal"
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavSecondary({
  items,
  ...props
}: {
  items: { title: string; url: string; icon: IconType }[];
} & React.ComponentProps<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className="py-5" asChild size="sm">
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
