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
    <>
      <ResultsCard title={titleTrans} functionName="calculatePoint">
        {(data: PointResults) => {
          const count = data.count;
          onPointCountCalculated(count);

          return (
            <>
              <p>
                📍
                <Trans i18nKey="PointCard sketch size message" values={{ count }}>
                  This sketch contains <b>{{ count }}</b> points.
                </Trans>
              </p>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

export const PointCardReportClient = () => {
  return (
    <Translator>
      <PointCard onPointCountCalculated={() => {}} />
    </Translator>
  );
};
