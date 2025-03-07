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
              📍 Total Point(s): <b>{totalCount}</b>
            </p>
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
