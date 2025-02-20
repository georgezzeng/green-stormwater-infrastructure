// // CollectionDetailsPage.tsx
// import React, { useEffect, useState } from "react";
// import calculateArea from "../functions/calculateArea.ts";
// import calculateLength from "../functions/calculateLength";
// import calculatePoint from "../functions/calculatePoint";
// import { roundDecimal } from "@seasketch/geoprocessing/client-core";

// // Define allowed feature types.
// export type FeatureType = "polygon" | "line" | "point";

// // Each feature in the collection has an id, a type, and a geometry.
// export interface CollectionFeature {
//   id: string;
//   type: FeatureType;
//   geometry: any; // Adjust this type based on your actual geometry structure.
// }

// interface CollectionDetailsPageProps {
//   features: CollectionFeature[];
//   onAreaCalculated?: (area: number) => void;
//   onLineDimensionsCalculated?: (length: number) => void;
//   onPointCountCalculated?: (count: number) => void;
// }

// const CollectionDetailsPage: React.FC<CollectionDetailsPageProps> = ({
//   features,
//   onAreaCalculated,
//   onLineDimensionsCalculated,
//   onPointCountCalculated,
// }) => {
//   const [totalArea, setTotalArea] = useState<number>(0);
//   const [totalLength, setTotalLength] = useState<number>(0);
//   const [totalPoints, setTotalPoints] = useState<number>(0);

//   useEffect(() => {
//     const fetchCalculations = async () => {
//       let areaSum = 0;
//       let lengthSum = 0;
//       let pointSum = 0;

//       // Separate features by type.
//       const polygonFeatures = features.filter((f) => f.type === "polygon");
//       const lineFeatures = features.filter((f) => f.type === "line");
//       const pointFeatures = features.filter((f) => f.type === "point");

//       // For polygon features, call the area handler.
//       if (polygonFeatures.length > 0) {
//         const areaPromises = polygonFeatures.map((feature) =>
//           calculateArea.handler(feature.geometry, {})
//         );
//         const areaResults = await Promise.all(areaPromises);
//         areaResults.forEach((result) => {
//           areaSum += roundDecimal(result.area, 2);
//         });
//       }

//       // For line features, call the length handler.
//       if (lineFeatures.length > 0) {
//         const lengthPromises = lineFeatures.map((feature) =>
//           calculateLength.handler(feature.geometry, {})
//         );
//         const lengthResults = await Promise.all(lengthPromises);
//         lengthResults.forEach((result) => {
//           lengthSum += roundDecimal(result.length, 2);
//         });
//       }

//       // For point features, call the point handler.
//       if (pointFeatures.length > 0) {
//         const pointPromises = pointFeatures.map((feature) =>
//           calculatePoint.handler(feature.geometry, {})
//         );
//         const pointResults = await Promise.all(pointPromises);
//         pointResults.forEach((result) => {
//           pointSum += result.count;
//         });
//       }

//       // Update state and invoke callbacks.
//       setTotalArea(areaSum);
//       setTotalLength(lengthSum);
//       setTotalPoints(pointSum);

//       if (onAreaCalculated) onAreaCalculated(areaSum);
//       if (onLineDimensionsCalculated) onLineDimensionsCalculated(lengthSum);
//       if (onPointCountCalculated) onPointCountCalculated(pointSum);
//     };

//     fetchCalculations();
//   }, [features, onAreaCalculated, onLineDimensionsCalculated, onPointCountCalculated]);

//   return (
//     <div>
//       <h2>Collection Report</h2>
//       <p>
//         <strong>Total Area:</strong> {totalArea} sq ft
//       </p>
//       <p>
//         <strong>Total Line Length:</strong> {totalLength} ft
//       </p>
//       <p>
//         <strong>Total Points:</strong> {totalPoints}
//       </p>
//     </div>
//   );
// };

// export default CollectionDetailsPage;
