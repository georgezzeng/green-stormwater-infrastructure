// src/clients/AreaReport.tsx
import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { AreaCard } from "../components/AreaCard.js";

// Named export loaded by storybook
export const AreaReport = () => {
  return (
    <Translator>
      <AreaCard />
    </Translator>
  );
};

// Default export lazy-loaded by top-level ReportApp
export default AreaReport;
