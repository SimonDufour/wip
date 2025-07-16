import { PropsWithChildren } from "react";

import { DashboardSidebar } from "@/components/interfaces/Dashboard/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@metrica/ui/components/sidebar";
import { DashboardLayoutHeader } from "@/components/layouts/DashboardLayout/DashboardLayoutHeader";
import MobileNavigationBar from "@/components/layouts/DashboardLayout/NavigationBar/MobileNavigationBar";
import { RenameDialog } from "@/components/interfaces/Dashboard/Dialogs/RenameDialog";
import { TrashDialog } from "@/components/interfaces/Dashboard/Dialogs/TrashDialog";
import { DeleteDialog } from "@/components/interfaces/Dashboard/Dialogs/DeleteDialog";

export interface DefaultLayoutProps {
  headerTitle?: string;
}

/**
 * Base layout for all dashboard pages, rendered as the first child on all routes
 *
 * A second layout as the child to this is required, and the layout depends on which section of the dashboard the page is on. (e.g Auth - AuthLayout)
 *
 * The base layout handles rendering the following UI components:
 * - Mobile navigation bar
 * - First level side navigation bar (e.g For navigating to the projects page, the trash, etc.)
 */
const DashboardDefaultLayout = ({
  children,
  headerTitle,
}: PropsWithChildren<DefaultLayoutProps>) => {
  return (
    <>
      <TrashDialog />
      <RenameDialog />
      <DeleteDialog />
      <SidebarProvider defaultOpen={true}>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardLayoutHeader headerTitle={headerTitle} />
          <div className="flex-grow h-full w-full overflow-y-auto">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default DashboardDefaultLayout;
