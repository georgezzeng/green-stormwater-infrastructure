import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const AmendedSoilReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="amendedSoil" />
    </Translator>
  );
};

export default AmendedSoilReport;
