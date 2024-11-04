
import React, { useState } from "react";
import { AreaCard } from "./AreaCard.tsx";
import InfrastructureChart from "./InfrastructureChart.tsx";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { InfrastructureConfig, infrastructureTypes } from "../data/infrastructureData.ts";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType }) => {
  const [area, setArea] = useState<number | null>(null);

  return (
    <>
      <AreaCard onAreaCalculated={setArea} />
      <SketchAttributesCard autoHide />

      {/* Render the InfrastructureChart based on provided infrastructure type and calculated area */}
      {area !== null && (
        <div style={{ padding: "2rem" }}>
          <h2>{infrastructureTypes[infrastructureType].name} Analysis</h2>
          <InfrastructureChart area={area} infrastructureType={infrastructureType} />
        </div>
      )}
    </>
  );
};

export default ViabilityPage;
