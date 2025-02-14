import burritosRaw from "./burritos.json";
import Map from "./Map";
import { BurritoReviewModel } from "./types";

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

export default function Home() {
  return <Map burritos={burritos} />;
}
