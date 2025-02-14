import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const RoadsideSwalesReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="roadsideSwales" />
    </Translator>
  );
};

export default RoadsideSwalesReport;
