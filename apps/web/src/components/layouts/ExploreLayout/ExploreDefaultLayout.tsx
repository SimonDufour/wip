"use client";

import { ReactNode } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@metrica/ui/components/resizable";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@metrica/ui/components/sheet";

import { cn } from "@metrica/ui/lib/utils";
import { useProjectStore } from "@/stores/useProjectStore";
import { MapContainer } from "@/components/interfaces/Map/MapContainer";
import { Icons } from "@metrica/ui/components/icons";
import { useIsMobile } from "@metrica/ui/hooks/use-mobile";
import { redirect, useParams, usePathname } from "next/navigation";
import { Button } from "@metrica/ui/components/button";
import { TabKind } from "@/types/tabs";

export interface FeatureLayoutProps {
  title?: string;
  isLoading?: boolean;
  isBlocking?: boolean;
  product?: string;
  sidePanel?: ReactNode;
  resizableSidebar?: boolean;
}

function ExploreDefaultLayout() {
  const { id } = useParams<{ id: string }>();

  const {
    assistantIsOpen,
    sidePanelContent,
    currentTab,
    selectTab,
    closeAssistant,
    closeSidePanel,
  } = useProjectStore();

  const isMobile = useIsMobile();

  return (
    <>
      {isMobile && (
        <MobileSheetNav header={currentTab.title} content={sidePanelContent} />
      )}
      <div className="flex flex-row h-full w-full">
        <ResizablePanelGroup direction="horizontal" autoSaveId="feature-layout">
          {sidePanelContent && (
            <ResizablePanel
              order={1}
              maxSize={33}
              defaultSize={20}
              id="panel-left"
              className="hidden md:block min-w-64 bg-sidebar"
            >
              <div className="flex items-center justify-between p-2 pl-4 pr-4 text-primary">
                <span className="font-medium text-lg">{currentTab.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    closeSidePanel();
                    selectTab({ kind: TabKind.Explore, title: "Explorer" });
                  }}
                >
                  <Icons.ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
              {sidePanelContent}
            </ResizablePanel>
          )}
          {sidePanelContent && <ResizableHandle withHandle />}
          <ResizablePanel
            order={2}
            id="panel-right"
            className="h-full flex flex-col w-full"
          >
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full w-full overflow-x-hidden flex-1 flex flex-row gap-0"
              autoSaveId="project-layout-content"
            >
              <ResizablePanel
                id="panel-content"
                className={cn("w-full xl:min-w-[600px] bg-dash-sidebar")}
              >
                <main className="h-full flex flex-col flex-1 w-full overflow-y-auto overflow-x-hidden @container">
                  <MapContainer />
                </main>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}

function MobileSheetNav({
  header,
  content,
}: {
  header: string;
  content: React.ReactNode;
}) {
  const pathname = usePathname().split("/")[-1];

  return (
    <Sheet>
      <header className="w-full h-12 flex items-center justify-between">
        {header}
        <SheetTrigger asChild>
          <Icons.Sidebar />
        </SheetTrigger>
      </header>
      <SheetContent>{content}</SheetContent>
    </Sheet>
  );
}

ExploreDefaultLayout.displayName = "ExploreLayout";

export default ExploreDefaultLayout;
