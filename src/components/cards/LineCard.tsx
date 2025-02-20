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

export const LineCard: React.FC<LineCardProps> = ({
  onLineDimensionsCalculated,
  extraParams,
}) => {
  const { t } = useTranslation();
  const titleTrans = t("LineCard title", "Line Report");

  return (
    <ResultsCard
      title={titleTrans}
      functionName="calculateLength"
      extraParams={{ geometryTypes: ["LineString", "MultiLineString"], ...extraParams }}
    >
      {(data: LengthResults) => {
        const totalLength = roundDecimal(data.length, 2);
        onLineDimensionsCalculated(totalLength);
        return (
          <div>
            <p>
              📏 Total Line Length:{" "}
              <b>{NumberFormatter.format(totalLength)}</b> feet.
            </p>
            {data.breakdown && data.breakdown.length > 0 && (
              <ul>
                {data.breakdown.map((l, index) => (
                  <li key={index}>
                    Line {index + 1}:{" "}
                    {NumberFormatter.format(roundDecimal(l, 2))} ft
                  </li>
                ))}
              </ul>
            )}
          </div>
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
