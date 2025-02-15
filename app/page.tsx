import burritosRaw from "./burritos.json";
import Map from "./Map";
import { BurritoReviewModel } from "./types";
import { textToPolygonMono } from "./cartographer";

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

const totalBurritosEaten = burritos.reduce(
  (acc, burrito) => acc + (burrito.count ?? 0),
  0,
);

const test = textToPolygonMono(
  `${totalBurritosEaten} burritos eaten`,
  [-117.7129, 51.5902],
  3.5,
  1.9,
);

export default function Home() {
  return <Map burritos={burritos} drawing={test} />;
}
