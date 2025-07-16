"use client";

import { useState, useMemo } from "react";

import { useDashboardStore } from "@/stores/useDashboardStore";

import { Icons } from "@metrica/ui/components/icons";
import {
  sortBy,
  ProjectSortDropdown,
  SortType,
} from "@/components/interfaces/ProjectSort";

import { ProjectsPanelHero } from "@/components/interfaces/Dashboard/ProjectsPanel/ProjectsPanelHero";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@metrica/ui/components/tabs";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsList } from "./ProjectsList";
import { LoadingSpinner } from "@metrica/ui/components/loading-spinner";
import { CreateProjectButton } from "../CreateProjectButton";

export function ProjectsPanel() {
  const [sortType, setSortType] = useState<SortType>("name");
  const projects = useDashboardStore((state) => state.projects);

  const sortedProjects = useMemo(
    () => sortBy(sortType, projects),
    [projects, sortType],
  );

  return (
    <main className="flex-1 p-4">
      <ProjectsPanelHero />
      <div className="pt-4">
        <Tabs defaultValue="grid">
          <div className="flex items-center justify-between">
            <ProjectSortDropdown
              value={sortType}
              onValueChange={(value: SortType) => setSortType(value)}
            />

            <div className="flex items-center gap-2">
              <TabsList>
                <TabsTrigger value="grid">
                  <Icons.Grid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <Icons.List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              <CreateProjectButton className="w-48" />
            </div>
          </div>

          {sortedProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <h3 className="text-lg font-semibold mb-2">
                  Aucun espace de travail trouvé
                </h3>
                <p>Créer votre premier espace de travail pour commencer</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <TabsContent value="grid">
                <ProjectsGrid projects={sortedProjects} />
              </TabsContent>
              <TabsContent value="list">
                <ProjectsList projects={sortedProjects} />
              </TabsContent>
            </div>
          )}
        </Tabs>
      </div>
    </main>
  );
}
