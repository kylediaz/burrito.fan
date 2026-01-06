import { Position } from "geojson";
import dynamic from "next/dynamic";

import burritosRaw from "./burritos.json";
import { BurritoReviewModel } from "./types";

const Map = dynamic(() => import("./Map"));
import { bigOverSmallText } from "./cartographer";
import { formatNumberWithCommas } from "./util";
import Preloader from "@/components/Preloader";

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

/*
Constructing the polygons for the text written on the map
must be done in here. This should all be computed during
build time, not on the client in the Map module.
*/

const polygons: Position[][][] = [];
const fontHeightToWidthRatio = 3.5 / 1.9;

const totalBurritosEaten = burritos.reduce(
  (acc, burrito) => acc + (burrito.count ?? 0),
  0,
);
polygons.push(
  ...bigOverSmallText(
    `${totalBurritosEaten}`,
    `burritos eaten`.toUpperCase(),
    [-112.7129, 34.1902],
    10,
    3.5,
    fontHeightToWidthRatio,
  ),
);

const caloriesConsumed = formatNumberWithCommas(totalBurritosEaten * 1250);
polygons.push(
  ...bigOverSmallText(
    `${caloriesConsumed}`,
    `calories consumed`.toUpperCase(),
    [57.7129, 30.1902],
    14.5,
    6,
    fontHeightToWidthRatio,
    1,
  ),
);

const regrets = burritos.reduce(
  (acc, burrito) => acc + (burrito.rating < 1.5 ? 1 : 0),
  0,
);
polygons.push(
  ...bigOverSmallText(
    `${regrets}`,
    `regrets`.toUpperCase(),
    [14.9618936490113251, -10],
    35,
    6,
    fontHeightToWidthRatio,
    1,
  ),
);

export default function Home() {
  return (
    <>
      <Preloader />
      <Map burritos={burritos} drawing={polygons} />
    </>
  );
}
