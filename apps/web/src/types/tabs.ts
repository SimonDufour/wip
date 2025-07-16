import React from "react";

import { Icons, IconType } from "@metrica/ui/components/icons";
import { ProjectSearchPanel } from "@/components/interfaces/Project/Search/ProjectSearchPanel";
import { ProjectLayersPanel } from "@/components/interfaces/Project/Layers/ProjectLayersPanel";
import { ProjectSitesPanel } from "@/components/interfaces/Project/Sites/ProjectSitesPanel";

export enum TabKind {
  Explore,
  Search,
  Layers,
  Sites,
}

export type Tab = {
  kind: TabKind;
  title: string;
};

export type TabRoute = {
  tab: Tab;
  icon: IconType;
  content: React.FunctionComponent;
};

export const TABS: TabRoute[] = [
  {
    tab: { kind: TabKind.Search, title: "Rechercher" },
    icon: Icons.Search,
    content: ProjectSearchPanel,
  },
  {
    tab: { kind: TabKind.Layers, title: "Données" },
    icon: Icons.Layers,
    content: ProjectLayersPanel,
  },
  {
    tab: { kind: TabKind.Layers, title: "Sites" },
    icon: Icons.Place,
    content: ProjectSitesPanel,
  },
];
