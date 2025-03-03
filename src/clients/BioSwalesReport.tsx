
import React from "react";
import Translator from "../components/TranslatorAsync.tsx";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const BioSwalesReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="bioSwales"/>
    </Translator>
  );
};

export default BioSwalesReport;
