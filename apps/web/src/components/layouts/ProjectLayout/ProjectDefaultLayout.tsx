import { ProjectSidebar } from "@/components/interfaces/Project/ProjectSidebar";
import { SidebarProvider } from "@metrica/ui/components/sidebar";
import MobileNavigationBar from "@/components/layouts/ProjectLayout/NavigationBar/MobileNavigationBar";
import { useIsMobile } from "@metrica/ui/hooks/use-mobile";

export interface DefaultLayoutProps {
  headerTitle?: string;
}

/**
 * Base layout for all project pages in the editor, rendered as the first child on all page files within a project.
 *
 * A second layout as the child to this is required, and the layout depends on which section of the dashboard the page is on. (e.g Auth - AuthLayout)
 *
 * The base layout handles rendering the following UI components:
 * - Mobile navigation bar
 * - First level side navigation bar (e.g For navigating to the project overview, map, analysis, etc.)
 */
const ProjectDefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col h-screen w-screen">
        {/* Top Banner */}
        {isMobile && (
          <div className="flex-shrink-0">
            <MobileNavigationBar />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 h-full w-full overflow-y-hidden">
          {/* Sidebar */}
          <aside className="absolute top-0 left-0 h-full z-20">
            <ProjectSidebar />
          </aside>
          {/* Main Content */}
          <div className="h-full w-full md:pl-12">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectDefaultLayout;
