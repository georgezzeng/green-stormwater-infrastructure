import React from "react";
import Translator from "../components/TranslatorAsync.js";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const ParkingLotSwalesReport = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="parkingLotSwales" />
    </Translator>
  );
};

export default ParkingLotSwalesReport;
