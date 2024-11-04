
import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const RainGardenReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="rainGarden"/>
    </Translator>
  );
};

export default RainGardenReport;
