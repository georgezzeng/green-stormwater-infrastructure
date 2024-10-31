import React from "react";
import { SimpleCard } from "./SimpleCard.js";
import { AreaCard } from "./AreaCard.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";

export const ViabilityPage = () => {
  return (
    <>
      <AreaCard />
      <SketchAttributesCard autoHide />
    </>
  );
};
