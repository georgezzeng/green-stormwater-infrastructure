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
    <>
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
                📏 Total Area:{" "}
                <b>{NumberFormatter.format(totalArea)}</b> square feet.
              </p>
              {data.breakdown && data.breakdown.length > 0 && (
                <ul>
                  {data.breakdown.map((a, index) => (
                    <li key={index}>
                      Polygon {index + 1}:{" "}
                      {NumberFormatter.format(roundDecimal(a, 2))} sq ft
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }}
      </ResultsCard>
    </>
  );
};

export const AreaCardReportClient = () => {
  return (
    <Translator>
      <AreaCard onAreaCalculated={() => {}} />
    </Translator>
  );
};
