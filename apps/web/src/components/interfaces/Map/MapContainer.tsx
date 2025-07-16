import React, { useCallback, useMemo } from "react";
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
  useControl,
} from "react-map-gl/maplibre";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";

import { MapViewState, DeckProps, PickingInfo } from "@deck.gl/core";

import type { MVTLayerPickingInfo } from "@deck.gl/geo-layers";

import "maplibre-gl/dist/maplibre-gl.css";
import GeocoderControl from "./GeocoderControl";
import { useProjectStore } from "@/stores/useProjectStore";
import { BASEMAPS, getBasemapUrl, getLayerData } from "@/lib/layers";
import { ProjectParcelPanel } from "../Project/Parcel/ProjectParcelPanel";
import { LoadingSpinner } from "@metrica/ui/components/loading-spinner";
import { TabKind } from "@/types/tabs";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(
    () => new MapboxOverlay(props as MapboxOverlayProps),
  );
  overlay.setProps(props as MapboxOverlayProps);
  return null;
}

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -71.15,
  latitude: 46.85,
  zoom: 10,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

function formatTooltip(object: MVTLayerPickingInfo["object"]) {
  if (!object || !object.properties) {
    return null;
  }

  const entries = Object.entries(object.properties);
  if (entries.length === 0) {
    return "No properties";
  }

  const style = "font-family: sans-serif; font-size: 12px; z-index: 10;";
  const content = entries
    .map(([key, value]) => `<b>${key}:</b> ${value}`)
    .join("<br/>");

  return {
    html: `<div style="${style}">${content}</div>`,
  };
}

export function MapContainer({
  initialViewState = INITIAL_VIEW_STATE,
}: {
  initialViewState?: MapViewState;
}) {
  const { project, openSidePanel, selectTab } = useProjectStore();

  const activeLayerKinds = project?.layers;

  const layersToRender = useMemo(() => {
    if (!activeLayerKinds) return [];

    return activeLayerKinds.map((kind) => {
      const layerData = getLayerData(kind);

      if (!layerData) return null;

      return layerData.layer.clone({});
    });
  }, [activeLayerKinds, openSidePanel]);

  if (!project?.basemap) {
    return <LoadingSpinner />;
  }

  const handleClick = (info: PickingInfo) => {
    switch (info.layer?.id) {
      case "parcels":
        selectTab({
          kind: TabKind.Explore,
          title: `Aperçu`,
        });
        openSidePanel(<ProjectParcelPanel />);
      default:
        return;
    }
  };

  return (
    <Map
      initialViewState={initialViewState}
      mapStyle={getBasemapUrl(project.basemap)}
    >
      <NavigationControl position="bottom-right" />
      <FullscreenControl position="bottom-right" />
      <GeolocateControl position="bottom-right" />
      <GeocoderControl position="top-left" />
      <ScaleControl style={{ background: "none" }} />
      <DeckGLOverlay
        layers={layersToRender}
        getTooltip={({ object }) => formatTooltip(object)}
        onClick={handleClick}
      />
    </Map>
  );
}
