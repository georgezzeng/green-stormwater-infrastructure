import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const PermeableParkingReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="permeableParking" />
    </Translator>
  );
};

export default PermeableParkingReport;
