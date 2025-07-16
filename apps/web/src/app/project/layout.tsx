"use client";

import ProjectDefaultLayout from "@/components/layouts/ProjectLayout/ProjectDefaultLayout";
import { useProjectStore } from "@/stores/useProjectStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams<{ id: string }>();
  const { fetchInitial } = useProjectStore();

  useEffect(() => {
    fetchInitial(id);
  }, [fetchInitial]);

  return <ProjectDefaultLayout>{children}</ProjectDefaultLayout>;
}
