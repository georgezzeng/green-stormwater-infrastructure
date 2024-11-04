import React, { useState } from "react";
import { AreaCard } from "./AreaCard.js";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import GreenRoofChart from "./GreenRoofChart.tsx";


export const ViabilityPage = () => {
  const [area, setArea] = useState<number | null>(null);

  return (
    <>
      <AreaCard onAreaCalculated={setArea}/>
      <SketchAttributesCard autoHide />

      {/* Only render GreenRoofChart if area is available */}
      {area !== null && (
        <div style={{ padding: "2rem" }}>
          <h2>Green Roof Analysis</h2>
          <GreenRoofChart area={area} />
        </div>
      )}
    </>
  );
};

