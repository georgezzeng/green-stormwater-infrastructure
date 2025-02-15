import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { LengthResults } from "../functions/calculateLength"; // Updated interface import
import Translator from "../components/TranslatorAsync.js";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const NumberFormatter = new Intl.NumberFormat("en", { style: "decimal" });

interface LineCardProps {
  onLineDimensionsCalculated: (length: number) => void; // Callback now only for length
  extraParams?: any; // Extra parameters (if needed) to pass to the backend
}

/**
 * LineCard component: calls the backend function "calculateLength" and displays
 * the length of the line.
 */
export const LineCard: React.FC<LineCardProps> = ({ onLineDimensionsCalculated, extraParams }) => {
  const { t } = useTranslation();
  const titleTrans = t("LineCard title", "Line Report");

  return (
    <ResultsCard title={titleTrans} functionName="calculateLength" extraParams={extraParams}>
      {(data: LengthResults) => {
        const length = roundDecimal(data.length, 2);
        onLineDimensionsCalculated(length);
        return (
          <p>
            📏{" "}
            <Trans i18nKey="LineCard sketch size message">
              This line has a length of <b>{{ length: NumberFormatter.format(length) }}</b> feet.
            </Trans>
          </p>
        );
      }}
    </ResultsCard>
  );
};

export const LineCardReportClient = () => {
  return (
    <Translator>
      <LineCard onLineDimensionsCalculated={(length) => console.log("Length:", length)} />
    </Translator>
  );
};
