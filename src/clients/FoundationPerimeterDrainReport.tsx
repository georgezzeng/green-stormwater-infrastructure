import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const FoundationPerimeterDrainReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="foundationPerimeterDrain" />
    </Translator>
  );
};

export default FoundationPerimeterDrainReport;
