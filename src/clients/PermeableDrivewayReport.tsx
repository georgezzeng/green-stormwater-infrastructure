import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const PermeableDrivewayReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="permeableDriveway" />
    </Translator>
  );
};

export default PermeableDrivewayReport;
