"use client";

import { useState, useMemo } from "react";

import { useDashboardStore } from "@/stores/useDashboardStore";

import { Icons } from "@metrica/ui/components/icons";
import {
  sortBy,
  ProjectSortDropdown,
  SortType,
} from "@/components/interfaces/ProjectSort";

import { TrashPanelHero } from "@/components/interfaces/Dashboard/TrashPanel/TrashPanelHero";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@metrica/ui/components/tabs";
import { TrashProjectsGrid } from "./TrashProjectsGrid";
import { TrashProjectsList } from "./TrashProjectsList";

export function TrashPanel() {
  const [sortType, setSortType] = useState<SortType>("name");
  const projects = useDashboardStore((state) => state.trashProjects);

  const sortedProjects = useMemo(
    () => sortBy(sortType, projects),
    [projects, sortType],
  );

  return (
    <main className="flex-1 p-4">
      <TrashPanelHero />
      <div className="mx-auto pt-4">
        <Tabs defaultValue="grid">
          <div className="flex items-center justify-between">
            <ProjectSortDropdown
              value={sortType}
              onValueChange={(value: string) => setSortType(value as SortType)}
            />

            <div className="flex items-center space-x-2">
              <TabsList>
                <TabsTrigger value="grid">
                  <Icons.Grid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <Icons.List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {sortedProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <h3 className="text-lg font-semibold mb-2">Corbeille vide</h3>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <TabsContent value="grid">
                <TrashProjectsGrid projects={sortedProjects} />
              </TabsContent>
              <TabsContent value="list">
                <TrashProjectsList projects={sortedProjects} />
              </TabsContent>
            </div>
          )}
        </Tabs>
      </div>
    </main>
  );
}
