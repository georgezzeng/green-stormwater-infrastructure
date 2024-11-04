
import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const PermeablePavementReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="permeablePavement"/>
    </Translator>
  );
};

export default PermeablePavementReport;
