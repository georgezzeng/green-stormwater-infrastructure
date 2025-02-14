import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const DrywellReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="drywell" />
    </Translator>
  );
};

export default DrywellReport;
