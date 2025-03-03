// CollectionCard.tsx
import React from "react";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { CollectionResults } from "../../functions/calcCollection.ts";
import Translator from "../TranslatorAsync.tsx";
import { roundDecimal } from "@seasketch/geoprocessing/client-core";

const NumberFormatter = new Intl.NumberFormat("en", { style: "decimal" });

interface CollectionCardProps {
  onTotalCalculated?: (total: number) => void;
  onCollectionCalculated?: (results: CollectionResults) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  onTotalCalculated = () => {},
  onCollectionCalculated = () => {},
}) => {
  return (
    <ResultsCard
      title="Collection Report"
      functionName="calcCollection"
      extraParams={{}} // Add extra params if needed
    >
      {(data: CollectionResults) => {
        // Notify parent with the overall total and full breakdown.
        onTotalCalculated(data.total);
        onCollectionCalculated(data);
        const totalFormatted = roundDecimal(data.total, 2);
        return (
          <div>
            {Object.keys(data.breakdown).map((practiceKey) => {
              const practiceData = data.breakdown[practiceKey];
              return (
                <div key={practiceKey} style={{ marginBottom: "1rem" }}>
                  <h4>{practiceKey}</h4>
                  <p>
                    Count: {practiceData.count}
                  </p>
                  <p>
                    Total:{" "}
                    {NumberFormatter.format(roundDecimal(practiceData.total, 2))}
                  </p>
                  <p>
                    Sketch Names:{" "}
                    {practiceData.sketchNames.join(", ")}
                  </p>
                  {practiceData.details.length > 0 && (
                    <>
                      <h5>Individual Details:</h5>
                      <ul>
                        {practiceData.details.map((detail, index) => (
                          <li key={index}>
                            {NumberFormatter.format(roundDecimal(detail, 2))}
                          </li>
                        ))}
                      </ul>
                      <br></br>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      }}
    </ResultsCard>
  );
};

export const CollectionCardReportClient = () => {
  return (
    <Translator>
      <CollectionCard
        onTotalCalculated={(total) => console.log("Total Metric:", total)}
        onCollectionCalculated={(results) => console.log("Collection breakdown:", results)}
      />
    </Translator>
  );
};
