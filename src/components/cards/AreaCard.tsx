import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { AreaResults } from "../../functions/calculateArea.ts";
import Translator from "../TranslatorAsync.tsx";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

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
          const area = roundDecimal(data.area, 2);
          console.log(area);
          onAreaCalculated(area);
          
          return (
            <>
              <p>
                📏
                <Trans i18nKey="AreaCard sketch size message">
                  This sketch covers <b>{{ area: Number.format(area) }}</b> square feet.
                </Trans>
              </p>
            </>
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
