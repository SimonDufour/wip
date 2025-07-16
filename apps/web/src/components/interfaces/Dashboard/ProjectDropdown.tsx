"use client";

import React from "react";

import { useDashboardStore } from "@/stores/useDashboardStore";
import { Database } from "@/types/database";
import { cn } from "@metrica/ui/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@metrica/ui/components/dropdown-menu";
import { Button } from "@metrica/ui/components/button";
import { Icons, IconType } from "@metrica/ui/components/icons";

export function RegularProjectDropdown({
  project,
  orientation = "vertical",
  ...props
}: {
  project: Database["public"]["Tables"]["projects"]["Row"];
  orientation?: "vertical" | "horizontal";
} & React.ComponentProps<typeof Button>) {
  const { openTrashDialog, openRenameDialog } = useDashboardStore();

  const items = [
    {
      title: "Ouvrir dans un nouvel onglet",
      icon: Icons.OpenInNew,
      handle: () => window.open(`/editor/${project.id}`),
    },
    {
      title: "Renommer",
      icon: Icons.Rename,
      handle: () => openRenameDialog(project),
    },
    {
      title: "Supprimer",
      icon: Icons.Delete,
      handle: () => openTrashDialog(project),
      separated: true,
    },
  ];

  return <Dropdown items={items} orientation={orientation} {...props} />;
}

export function TrashProjectDropdown({
  project,
  orientation = "vertical",
  ...props
}: {
  project: Database["public"]["Tables"]["projects"]["Row"];
  orientation?: "vertical" | "horizontal";
} & React.ComponentProps<typeof Button>) {
  const { openDeleteDialog } = useDashboardStore();
  const { unTrashProject } = useDashboardStore();

  const items = [
    {
      title: "Restaurer",
      icon: Icons.Restore,
      handle: () => unTrashProject(project),
    },
    {
      title: "Supprimer définitivement",
      icon: Icons.Delete,
      handle: () => openDeleteDialog(project),
      separated: true,
    },
  ];

  return <Dropdown items={items} {...props} />;
}

function Dropdown({
  items,
  orientation = "vertical",
  ...props
}: {
  items: {
    title: string;
    icon: IconType;
    separated?: boolean;
    handle: () => void;
  }[];
  orientation?: "vertical" | "horizontal";
} & React.ComponentProps<typeof Button>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            orientation === "horizontal" ? "h-8 w-10 " : "h-10 w-10",
            props,
          )}
        >
          {orientation === "horizontal" ? (
            <Icons.MoreHorizontal className="size-5" />
          ) : (
            <Icons.MoreVertical className="size-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <React.Fragment key={item.title}>
            {item?.separated && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={item.handle} key={item.title}>
              <item.icon />
              {item.title}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
