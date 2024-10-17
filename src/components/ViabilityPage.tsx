import React from "react";
import { SimpleCard } from "./SimpleCard.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { BoundaryAreaOverlap } from "./BoundaryAreaOverlap.tsx";

export const ViabilityPage = () => {
  return (
    <>
      <SimpleCard />
      <BoundaryAreaOverlap />
      <SketchAttributesCard autoHide />
    </>
  );
};
