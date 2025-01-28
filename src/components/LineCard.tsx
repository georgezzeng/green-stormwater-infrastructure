import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { LineResults } from "../functions/calculateLine.ts";
import Translator from "../components/TranslatorAsync.js";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

interface LineCardProps {
  onLineLengthCalculated: (length: number) => void; // Callback to pass length to parent
}

/**
 * LineCard component
 */
export const LineCard: React.FC<LineCardProps> = ({ onLineLengthCalculated }) => {
  const { t } = useTranslation();
  const titleTrans = t("LineCard title", "Line Report");

  return (
    <>
      <ResultsCard title={titleTrans} functionName="calculateLine">
        {(data: LineResults) => {
          const length = roundDecimal(data.length, 2);
          onLineLengthCalculated(length); // Pass the length up to the parent

          return (
            <>
              <p>
                📏
                <Trans i18nKey="LineCard sketch size message">
                  This sketch has a total line length of <b>{{ length: Number.format(length) }}</b> feet.
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
      <LineCard onLineLengthCalculated={() => {}} />
    </Translator>
  );
};
