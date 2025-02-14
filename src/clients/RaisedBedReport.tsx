import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const RaisedBedReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="raisedBed" />
    </Translator>
  );
};

export default RaisedBedReport;
