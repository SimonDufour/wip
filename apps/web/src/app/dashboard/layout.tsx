"use client";

import DashboardDefaultLayout from "@/components/layouts/DashboardLayout/DashboardDefaultLayout";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname().split("/")[2];

  const titleMap: { [key: string]: string } = {
    projects: "Projets",
    Notification: "Notifications",
    trash: "Corbeille",
  };

  const headerTitle = titleMap[pathname as string] ?? pathname;

  const { fetchInitial } = useDashboardStore();

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  return (
    <DashboardDefaultLayout headerTitle={headerTitle}>
      {children}
    </DashboardDefaultLayout>
  );
}
