
import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const GreenRoofReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="swale"/>
    </Translator>
  );
};

export default GreenRoofReport;
