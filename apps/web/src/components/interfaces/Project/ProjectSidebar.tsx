import React from "react";
import { ComponentProps, ComponentPropsWithoutRef, FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, MotionProps } from "motion/react";

import { useProjectStore } from "@/stores/useProjectStore";
import { useIsMobile } from "@metrica/ui/hooks/use-mobile";
import { cn } from "@metrica/ui/lib/utils";

import { Icons } from "@metrica/ui/components/icons";
import {
  SidebarContent as SidebarContentPrimitive,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
  useSidebar,
} from "@metrica/ui/components/sidebar";
import { TABS } from "@/types/tabs";

export const ICON_SIZE = 20;
export const ICON_STROKE_WIDTH = 0;
export type SidebarBehaviourType = "expandable" | "open" | "closed";
export const DEFAULT_SIDEBAR_BEHAVIOR = "expandable";

const SidebarMotion = motion(SidebarPrimitive) as unknown as FC<
  ComponentProps<typeof SidebarPrimitive> & {
    transition?: MotionProps["transition"];
  }
>;

export interface SidebarProps
  extends ComponentPropsWithoutRef<typeof SidebarPrimitive> {}

export const ProjectSidebar = ({ ...props }: SidebarProps) => {
  const { setOpen } = useSidebar();

  return (
    <AnimatePresence>
      <SidebarMotion
        {...props}
        transition={{ delay: 0.0, duration: 0.0 }}
        collapsible="icon"
        variant="sidebar"
        onMouseEnter={() => {
          setOpen(true);
        }}
        onMouseLeave={() => {
          setOpen(false);
        }}
      >
        <SidebarContent />
      </SidebarMotion>
    </AnimatePresence>
  );
};

export const SidebarContent = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <SidebarHeader className="p-0">
        <NavHeader />
      </SidebarHeader>
      <AnimatePresence mode="wait">
        <SidebarContentPrimitive className="flex flex-col">
          <motion.div key="content">
            <NavContent />
          </motion.div>
        </SidebarContentPrimitive>
      </AnimatePresence>
      {!isMobile && (
        <SidebarFooter className="p-0 ">
          <NavFooter />
        </SidebarFooter>
      )}
    </>
  );
};

const NavHeader = () => {
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "flex h-16 items-center gap-2 transition-all duration-300 ",
      )}
    >
      <Icons.Logo size={40} className="shrink-0 pl-2 text-primary" />

      <AnimatePresence>
        {(open || isMobile) && (
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="whitespace-nowrap text-2xl font-bold text-primary"
          >
            Metrica
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavContent = () => {
  const { currentTab, selectTab, openSidePanel } = useProjectStore();

  return (
    <SidebarMenu>
      <SidebarGroup>
        {TABS.map((route) => (
          <SidebarMenuItem
            key={`tab-${route.tab.title}`}
            className="py-2 hover:bg-muted hover:rounded-lg cursor-default text-foreground"
          >
            <SidebarMenuButton
              asChild
              className={cn(
                currentTab === route.tab && "bg-secondary hover:bg-secondary",
                "cursor-grab",
              )}
              onClick={() => {
                selectTab(route.tab);
                openSidePanel(React.createElement(route.content));
              }}
            >
              <div className="h-4 hover:px-4 cursor-pointer">
                {React.createElement(route.icon)}
                {route.tab.title}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>
    </SidebarMenu>
  );
};

const NavFooter = () => {
  const pathname = usePathname();

  const routes = [
    {
      key: "settings",
      title: "Paramètres",
      icon: Icons.Settings,
      link: `/dashboard/settings`,
    },
    {
      key: "back",
      title: "Autres projets",
      icon: Icons.ChevronLeft,
      link: `/dashboard/projects`,
    },
  ];

  return (
    <SidebarMenu>
      <SidebarGroup className="gap-3 justify-center">
        {routes.map((route) => (
          <SidebarMenuItem key={`Footer-routes-${route.title}`}>
            <SidebarMenuButton
              asChild
              className={cn(
                pathname.endsWith(route.key) &&
                  "bg-secondary hover:bg-secondary font-medium",
              )}
            >
              <Link href={route.link}>
                {React.createElement(route.icon)}
                {route.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>
    </SidebarMenu>
  );
};
