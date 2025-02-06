"use client";

import { useState } from "react";

import styles from "./Page.module.scss";
import burritosRaw from "./burritos.json";
import BurritoReviews from "./BurritoReviews";
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
  const [focusedEntry, setFocusedEntry] = useState({ idx: -1, source: "none" });

  return (
    <div>
      <header className={styles.header}>burrito.fan</header>
      <div className={styles.mainContainer}>
        <Map
          burritos={burritos}
          focusedEntry={focusedEntry}
          setFocusedEntry={setFocusedEntry}
        />
        <section className={`sm:w-1/2 w-full h-2/3 sm:h-full`}>
          <BurritoReviews
            burritos={burritos}
            focusedEntry={focusedEntry}
            setFocusedEntry={setFocusedEntry}
          />
        </section>
      </div>
    </div>
  );
}
