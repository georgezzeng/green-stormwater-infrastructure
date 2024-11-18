// src/components/PerimeterCard.tsx
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { PerimeterResults } from "../functions/calculatePerim.ts";
import Translator from "../components/TranslatorAsync.js";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

interface PerimeterCardProps {
  onPerimeterCalculated: (perimeter: number) => void; // Callback to pass perimeter to parent
}

/**
 * PerimeterCard component
 */
export const PerimeterCard: React.FC<PerimeterCardProps> = ({ onPerimeterCalculated }) => {
  const { t } = useTranslation();
  const titleTrans = t("PerimeterCard title", "Perimeter Report");

  return (
    <>
      <ResultsCard title={titleTrans} functionName="calculatePerim">
        {(data: PerimeterResults) => {
          const perimeter = roundDecimal(data.perimeter, 2);
          onPerimeterCalculated(perimeter); // Pass the perimeter up to the parent
          
          return (
            <>
              <p>
                📐
                <Trans i18nKey="PerimeterCard sketch size message">
                  This sketch has a perimeter of <b>{{ perimeter: Number.format(perimeter) }}</b> feet.
                </Trans>
              </p>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

/**
 * PerimeterCard as a top-level report client
 */
export const PerimeterCardReportClient = () => {
  return (
    <Translator>
      <PerimeterCard onPerimeterCalculated={() => {}} /> {/* Placeholder function */}
    </Translator>
  );
};
