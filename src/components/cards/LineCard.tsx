import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { LengthResults } from "../../functions/calculateLength.ts";
import Translator from "../TranslatorAsync.tsx";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const NumberFormatter = new Intl.NumberFormat("en", { style: "decimal" });

interface LineCardProps {
  onLineDimensionsCalculated: (length: number) => void;
  extraParams?: any;
}

export const LineCard: React.FC<LineCardProps> = ({ onLineDimensionsCalculated, extraParams }) => {
  const { t } = useTranslation();
  const titleTrans = t("LineCard title", "Line Report");

  return (
    <ResultsCard 
      title={titleTrans} 
      functionName="calculateLength" 
      extraParams={{ geometryTypes: ["LineString", "MultiLineString"], ...extraParams }}
    >
      {(data: LengthResults) => {
        const length = roundDecimal(data.length, 2);
        console.log("Calculated line length:", length);
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
