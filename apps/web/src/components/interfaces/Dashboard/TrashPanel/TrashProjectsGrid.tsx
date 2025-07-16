"use client";

import Image from "next/image";

import type { Database } from "@/types/database";
import { formatDate } from "@/lib/date";

import { TrashProjectDropdown } from "@/components/interfaces/Dashboard/ProjectDropdown";

function ProjectCard({
  project,
}: {
  project: Database["public"]["Tables"]["projects"]["Row"];
}) {
  return (
    <div className="bg-card rounded-sm border hover:border-primary/80 transition-shadow ">
      <div className="aspect-[4/3] bg-muted rounded-t-sm overflow-hidden">
        {project.preview_url ? (
          <Image
            src={project.preview_url}
            alt={`Preview of ${project.title}`}
            width={267}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-[267px] object-cover"></div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{project.title}</h3>
            <p className="text-xs text-muted-foreground">
              {formatDate(project.updated_at as string)}
            </p>
          </div>

          <TrashProjectDropdown project={project} />
        </div>
      </div>
    </div>
  );
}

export function TrashProjectsGrid({
  projects,
}: {
  projects: Database["public"]["Tables"]["projects"]["Row"][];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2  lg:grid-cols-4  2xl:grid-cols-6 ">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
