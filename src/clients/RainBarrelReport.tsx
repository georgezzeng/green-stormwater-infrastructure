import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const RainBarrelReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="rainBarrel" />
    </Translator>
  );
};

export default RainBarrelReport;
