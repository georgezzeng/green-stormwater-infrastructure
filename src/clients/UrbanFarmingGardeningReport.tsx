import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const UrbanFarmingGardeningReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="urbanFarmingGardening" />
    </Translator>
  );
};

export default UrbanFarmingGardeningReport;
