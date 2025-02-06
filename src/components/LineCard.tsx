import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { LengthResults } from "../functions/calculateLength.ts"; // Updated interface import
import Translator from "../components/TranslatorAsync.js";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

interface LineCardProps {
  onLineDimensionsCalculated: (length: number, width: number) => void; // Callback for both dimensions
  extraParams?: any; // Extra parameters (e.g. width override) to pass to the backend
}

/**
 * LineCard component: calls the backend function "calculateLength" and displays
 * both the longer side (length) and the shorter side (width) of the polygon.
 */
export const LineCard: React.FC<LineCardProps> = ({ onLineDimensionsCalculated, extraParams }) => {
  const { t } = useTranslation();
  const titleTrans = t("LineCard title", "Line Report");

  return (
    <>
      <ResultsCard title={titleTrans} functionName="calculateLength" extraParams={extraParams}>
        {(data: LengthResults) => {
          const length = roundDecimal(data.length, 2);
          const width = roundDecimal(data.width, 2);
          onLineDimensionsCalculated(length, width);
          return (
            <>
              <p>
                📏
                <Trans i18nKey="LineCard sketch size message">
                  This sketch has a length of <b>{{ length: Number.format(length) }}</b> feet and a width of <b>{{ width: Number.format(width) }}</b> feet.
                </Trans>
              </p>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

export const LineCardReportClient = () => {
  return (
    <Translator>
      <LineCard onLineDimensionsCalculated={() => {}} />
    </Translator>
  );
};
