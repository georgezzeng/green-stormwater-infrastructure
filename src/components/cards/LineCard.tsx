// LineCard.tsx
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
              📏 Total Line Length: <b>{NumberFormatter.format(totalLength)}</b> feet.
            </p>
            {data.breakdown && Object.keys(data.breakdown).length > 0 && (
              <>
                <h4>Counts by Geometry:</h4>
                <ul>
                  {Object.entries(data.breakdown).map(([geomType, count]) => (
                    <li key={geomType}>
                      {geomType}: {count} {count === 1 ? "sketch" : "sketches"}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {data.details && Object.keys(data.details).length > 0 && (
              <>
                <h4>Individual Lengths (ft):</h4>
                {Object.entries(data.details).map(([geomType, lengths]) => (
                  <div key={geomType}>
                    <strong>{geomType}:</strong>
                    <ul>
                      {lengths.map((l, i) => (
                        <li key={i}>{NumberFormatter.format(roundDecimal(l, 2))}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
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
