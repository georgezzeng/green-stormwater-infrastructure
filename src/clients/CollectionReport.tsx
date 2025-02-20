import React from "react";
import Translator from "../components/TranslatorAsync.tsx";
import { ViabilityPage } from "../components/ViabilityPage.tsx";

export const CollectionReport: React.FC = () => {
  return (
    <Translator>
      <ViabilityPage infrastructureType="collection" />
    </Translator>
  );
};

export default CollectionReport;
