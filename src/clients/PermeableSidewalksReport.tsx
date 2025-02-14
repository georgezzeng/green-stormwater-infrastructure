import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const PermeableSidewalksReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="permeableSidewalks" />
    </Translator>
  );
};

export default PermeableSidewalksReport;
