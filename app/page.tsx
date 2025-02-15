import { Position } from "geojson";

import burritosRaw from "./burritos.json";
import Map from "./Map";
import { BurritoReviewModel } from "./types";
import { textToPolygonMono } from "./cartographer";
import { formatNumberWithCommas } from "./util";

const burritos: BurritoReviewModel[] = burritosRaw
  .map((raw) => raw as BurritoReviewModel)
  .toSorted((a, b) => {
    if (a.date == undefined) {
      return 1;
    } else if (b.date == undefined) {
      return -1;
    } else {
      return -a.date.localeCompare(b.date);
    }
  });

const polygons: Position[][][] = [];
const fontHeightToWidthRatio = 3.5 / 1.9;

const totalBurritosEaten = burritos.reduce(
  (acc, burrito) => acc + (burrito.count ?? 0),
  0,
);

polygons.push(
  ...textToPolygonMono(
    `${totalBurritosEaten} burritos eaten`.toUpperCase(),
    [-117.7129, 52.1902],
    3.5,
    3.5 / fontHeightToWidthRatio,
  ),
);

const caloriesConsumed = formatNumberWithCommas(totalBurritosEaten * 1250);

polygons.push(
  ...textToPolygonMono(
    `${caloriesConsumed} calories consumed`.toUpperCase(),
    [55.7129, 60.1902],
    4.5,
    4.5 / fontHeightToWidthRatio,
  ),
);

export default function Home() {
  return <Map burritos={burritos} drawing={polygons} />;
}
