import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const PermeablePatioReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="permeablePatio" />
    </Translator>
  );
};

export default PermeablePatioReport;
