// src/components/AreaCard.tsx
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
// Import the results type definition from your functions to type-check and
// access the result in your component render function
import { AreaResults } from "../functions/calculateArea.js";
import Translator from "../components/TranslatorAsync.js";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

/**
 * AreaCard component
 */
export const AreaCard = () => {
  const { t } = useTranslation();
  const titleTrans = t("AreaCard title", "Area Report");

  return (
    <>
      <ResultsCard title={titleTrans} functionName="calculateArea">
        {(data: AreaResults) => {
          console.log("Area Results:", data);
          return (
            <>
              <p>
                📏
                <Trans i18nKey="AreaCard sketch size message">
                  This sketch covers{" "}
                  <b>{{ area: Number.format(roundDecimal(data.area, 2)) }}</b>{" "}
                  square feet.
                </Trans>
              </p>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};

/**
 * AreaCard as a top-level report client
 */
export const AreaCardReportClient = () => {
  return (
    <Translator>
      <AreaCard />
    </Translator>
  );
};
