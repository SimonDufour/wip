import { ReactNode, useMemo } from "react";

import { useParams } from "next/navigation";

import { cn } from "@metrica/ui/lib/utils";

const LayoutHeaderDivider = ({
  className,
  ...props
}: React.HTMLProps<HTMLSpanElement>) => (
  <span className={cn("text-border-stronger pr-2", className)} {...props}>
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
    >
      <path d="M16 3.549L7.12 20.600" />
    </svg>
  </span>
);

interface LayoutHeaderProps {
  customHeaderComponents?: ReactNode;
  breadcrumbs?: any[];
  headerTitle?: string;
  showProductMenu?: boolean;
}

const ProjectLayoutHeader = ({
  customHeaderComponents,
  breadcrumbs = [],
  headerTitle,
  showProductMenu,
}: LayoutHeaderProps) => {
  const { ref: projectRef, slug } = useParams();

  return (
    <header className={cn("flex h-12 items-center flex-shrink-0 border-b")}>
      Hi!
    </header>
  );
};

export default ProjectLayoutHeader;
