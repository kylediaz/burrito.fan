import burritosRaw from "./burritos.json";
import Map from "./Map";
import { BurritoReviewModel } from "./types";
import { textToPolygon } from "./cartographer";

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

const test = textToPolygon(
  `${totalBurritosEaten} burritos eaten`,
  [-120.7129, 52.0902],
  5,
);

export default function Home() {
  return <Map burritos={burritos} drawing={test} />;
}
