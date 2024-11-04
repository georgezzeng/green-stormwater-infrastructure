// src/clients/AreaReport.tsx
import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

// Named export loaded by storybook
export const AreaReport = () => {
  return (
    <Translator>
      <ViabilityPage />
    </Translator>
  );
};

// Default export lazy-loaded by top-level ReportApp
export default AreaReport;
