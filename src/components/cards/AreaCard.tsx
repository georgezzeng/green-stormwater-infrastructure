// AreaCard.tsx
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { AreaResults } from "../../functions/calculateArea.ts";
import Translator from "../TranslatorAsync.tsx";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const NumberFormatter = new Intl.NumberFormat("en", { style: "decimal" });

interface AreaCardProps {
  onAreaCalculated: (area: number) => void;
}

export const AreaCard: React.FC<AreaCardProps> = ({ onAreaCalculated }) => {
  const { t } = useTranslation();
  const titleTrans = t("AreaCard title", "Area Report");

  return (
    <ResultsCard
      title={titleTrans}
      functionName="calculateArea"
      extraParams={{ geometryTypes: ["Polygon", "MultiPolygon"] }}
    >
      {(data: AreaResults) => {
        console.log("Data from calculateArea:", data);
        const totalArea = roundDecimal(data.area, 2);
        onAreaCalculated(totalArea);
        return (
          <div>
            <p>
              📏 Total Area: <b>{NumberFormatter.format(totalArea)}</b> square feet.
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
                <h4>Individual Areas (sq ft):</h4>
                {Object.entries(data.details).map(([geomType, areas]) => (
                  <div key={geomType}>
                    <strong>{geomType}:</strong>
                    <ul>
                      {areas.map((a, i) => (
                        <li key={i}>{NumberFormatter.format(roundDecimal(a, 2))}</li>
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

export const AreaCardReportClient = () => {
  return (
    <Translator>
      <AreaCard onAreaCalculated={() => {}} />
    </Translator>
  );
};
