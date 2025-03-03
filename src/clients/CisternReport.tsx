import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const CisternReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="cistern" />
    </Translator>
  );
};

export default CisternReport;
