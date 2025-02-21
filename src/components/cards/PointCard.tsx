// PointCard.tsx
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { PointResults } from "../../functions/calculatePoint.ts";
import Translator from "../TranslatorAsync.tsx";

interface PointCardProps {
  onPointCountCalculated: (count: number) => void;
}

export const PointCard: React.FC<PointCardProps> = ({ onPointCountCalculated }) => {
  const { t } = useTranslation();
  const titleTrans = t("PointCard title", "Point Count Report");

  return (
    <ResultsCard
      title={titleTrans}
      functionName="calculatePoint"
      extraParams={{ geometryTypes: ["Point", "MultiPoint"] }}
    >
      {(data: PointResults) => {
        const totalCount = data.count;
        onPointCountCalculated(totalCount);
        return (
          <div>
            <p>
              📍 Total Points: <b>{totalCount}</b> ...
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
                <h4>Individual Counts:</h4>
                {Object.entries(data.details).map(([geomType, counts]) => (
                  <div key={geomType}>
                    <strong>{geomType}:</strong>
                    <ul>
                      {counts.map((c, i) => (
                        <li key={i}>{c}</li>
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

export const PointCardReportClient = () => {
  return (
    <Translator>
      <PointCard onPointCountCalculated={() => {}} />
    </Translator>
  );
};
