import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const VegetationFilterStripReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="vegetationFilterStrip" />
    </Translator>
  );
};

export default VegetationFilterStripReport;
