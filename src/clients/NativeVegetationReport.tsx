import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const NativeVegetationReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="nativeVegetation" />
    </Translator>
  );
};

export default NativeVegetationReport;
