import React from "react";

import { PickingInfo } from "@deck.gl/core";

/* placeholder until we get the right data names */
type zoning = {
  lot_number: number;
  zoning: string;
  max_height: number;
  max_density: number;
};

type TooltipProps = {
  hoverInfo?: PickingInfo<zoning>;
};

export default function MapTooltip({ hoverInfo }: TooltipProps) {
  if (!hoverInfo?.object) return null;

  return (
    <div
      className="absolute z-10 flex flex-col justify-between max-w-[50ch] pointer-events-none bg-white opacity-100 p-2.5 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.15)] font-[Geist] border border-[var(--primary)]"
      style={{ left: hoverInfo.x, top: hoverInfo.y }}
    >
      <div>{hoverInfo.object.message}</div>
      <span>
        SAMPLE TEXT : Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Reiciendis laboriosam, harum sit sint magnam atque quo ipsum impedit
        eius sed dicta nulla amet excepturi sunt velit dolorum expedita
        distinctio nam.
      </span>
    </div>
  );
}
