"use client";

import { useRouter } from "next/navigation";

import { useDashboardStore } from "@/stores/useDashboardStore";

import { Button } from "@metrica/ui/components/button";
import { LoadingSpinner } from "@metrica/ui/components/loading-spinner";
import { Icons } from "@metrica/ui/components/icons";
import { useState } from "react";

export function CreateProjectButton({
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const [isLoading, setIsLoading] = useState(false);
  const { createProject } = useDashboardStore();
  const router = useRouter();

  const handleCreateProject = async () => {
    setIsLoading(true);
    try {
      const newProjectId = await createProject("Projet sans titre");
      setIsLoading(false);
      if (newProjectId) {
        router.push(`/project/${newProjectId}/explore`);
      }
    } catch (error) {
      console.error("Failed to create project and redirect.", error);
    }
  };

  return (
    <Button className="w-full py-5 " onClick={handleCreateProject} {...props}>
      {isLoading ? (
        <LoadingSpinner className="h-10 w-10" />
      ) : (
        <>
          <Icons.Add className="size-5" />
          <span className="font-medium">Nouveau Projet</span>
        </>
      )}
    </Button>
  );
}
