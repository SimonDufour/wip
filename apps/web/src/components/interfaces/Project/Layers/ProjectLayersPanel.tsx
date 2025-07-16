import { useProjectStore } from "@/stores/useProjectStore";
import { BASEMAPS, getBasemapUrl, LAYERS } from "@/lib/layers";
import { cn } from "@metrica/ui/lib/utils";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@metrica/ui/components/tooltip";

function ProjectLayersPanel() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <h3 className="text-muted-foreground">Carte</h3>
      <BasemapCards />
      <h3 className="text-muted-foreground">Couches</h3>
      <LayerCards />
    </div>
  );
}

function BasemapCards() {
  const { project, selectBasemap } = useProjectStore();

  return (
    <div className="flex flex-wrap gap-2">
      {" "}
      {BASEMAPS.map((basemap) => (
        <div key={basemap.title} onClick={() => selectBasemap(basemap.kind)}>
          <Card
            title={basemap.title}
            previewUrl={basemap.previewUrl}
            active={basemap.kind === project?.basemap}
          />
        </div>
      ))}
    </div>
  );
}

function LayerCards() {
  const { project, toggleLayer } = useProjectStore();
  const activeLayers = project?.layers;

  return (
    <div className="flex flex-wrap gap-2">
      {" "}
      {LAYERS.map((layer) => (
        <div key={layer.title} onClick={() => toggleLayer(layer.kind)}>
          <Card
            title={layer.title}
            previewUrl={layer.previewUrl}
            active={activeLayers?.includes(layer.kind) ?? false}
          />
        </div>
      ))}
    </div>
  );
}

function Card({
  title,
  previewUrl,
  active,
}: {
  title: string;
  previewUrl: string;
  active: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Image
          src={previewUrl}
          alt={`Preview of ${title}`}
          width={100}
          height={100}
          className={cn(
            active ? "border-primary" : "",
            " w-20 rounded-sm cursor-grab border-3  hover:border-primary  transition-transform",
          )}
        />
      </TooltipTrigger>
      <TooltipContent side="bottom">{title}</TooltipContent>
    </Tooltip>
  );
}

export { ProjectLayersPanel };
