import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const PlanterBoxesReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="planterBoxes" />
    </Translator>
  );
};

export default PlanterBoxesReport;
