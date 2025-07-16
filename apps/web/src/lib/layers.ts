import { useProjectStore } from "@/stores/useProjectStore";
import { Constants } from "@/types/database";
import { Layer, PickingInfo } from "@deck.gl/core";
import { MVTLayer } from "@deck.gl/geo-layers";

export type LayerInfo = {
  kind: (typeof Constants)["public"]["Enums"]["Layers"][number];
  title: string;
  previewUrl: string;
  layer: Layer;
};

export const LAYERS: LayerInfo[] = [
  {
    kind: "Parcels",
    title: "Cadastre",
    previewUrl: "/parcels-map.png",
    layer: new MVTLayer({
      id: "parcels",
      data: [
        "https://api.maptiler.com/tiles/0197e566-5d25-77b6-9ba2-1c0d17c593b9/{z}/{x}/{y}.pbf?key=fYoEr6N1wmxjx0Hbnhao",
      ],
      minZoom: 14,
      maxZoom: 15,
      uniqueIdProperty: "NO_LOT",
      binary: true,

      getLineColor: [5, 150, 105],
      getFillColor: [0, 0, 0, 0],

      getLineWidth: 0.5,

      lineWidthMinPixels: 0.5,

      pickable: true,
      autoHighlight: true,
      highlightColor: [5, 150, 105, 100],
    }),
  },
];

type LayerData = Pick<LayerInfo, "title" | "layer">;

const layerMap = new Map<
  (typeof Constants)["public"]["Enums"]["Layers"][number],
  LayerData
>(
  LAYERS.map((layerInfo) => [
    layerInfo.kind,
    {
      title: layerInfo.title,
      layer: layerInfo.layer,
    },
  ]),
);

export function getLayerData(
  kind: (typeof Constants)["public"]["Enums"]["Layers"][number],
): LayerData | undefined {
  return layerMap.get(kind);
}

export type BasemapInfo = {
  kind: (typeof Constants)["public"]["Enums"]["Basemaps"][number];
  title: string;
  url: string;
  previewUrl: string;
};

export const BASEMAPS: BasemapInfo[] = [
  {
    kind: "Satellite",
    title: "Satellite",
    url: "https://api.maptiler.com/maps/satellite/style.json?key=fYoEr6N1wmxjx0Hbnhao",
    previewUrl: "/satellite-map.png",
  },
  {
    kind: "Streets",
    title: "Rues",
    url: "https://api.maptiler.com/maps/streets-v2/style.json?key=fYoEr6N1wmxjx0Hbnhao",
    previewUrl: "/streets-map.png",
  },
  {
    kind: "Topographic",
    title: "Topographique",
    url: "https://api.maptiler.com/maps/topo-v2/style.json?key=fYoEr6N1wmxjx0Hbnhao",
    previewUrl: "/topographic-map.png",
  },
  {
    kind: "Dark",
    title: "Sombre",
    url: "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=fYoEr6N1wmxjx0Hbnhao",
    previewUrl: "/dark-map.png",
  },
  {
    kind: "Light",
    title: "Claire",
    url: "https://api.maptiler.com/maps/streets-v2-light/style.json?key=fYoEr6N1wmxjx0Hbnhao",
    previewUrl: "/light-map.png",
  },
];

const basemapMap = new Map<
  (typeof Constants)["public"]["Enums"]["Basemaps"][number],
  string
>(BASEMAPS.map((basemap) => [basemap.kind, basemap.url]));

export function getBasemapUrl(
  kind: (typeof Constants)["public"]["Enums"]["Basemaps"][number],
): string | undefined {
  return basemapMap.get(kind);
}
