
import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

// Named export loaded by storybook
export const GreenRoofReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="Green Roof"/>
    </Translator>
  );
};

// Default export lazy-loaded by top-level ReportApp
export default GreenRoofReport;
