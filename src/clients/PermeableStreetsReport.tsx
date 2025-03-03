import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const PermeableStreetsReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="permeableStreets" />
    </Translator>
  );
};

export default PermeableStreetsReport;
