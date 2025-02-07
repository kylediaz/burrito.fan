import React from "react";

import styles from "./Header.module.scss";
import { BurritoReviewModel } from "@/app/types";
import BigNumber from "./BigNumber";

export interface Props {
  burritos: BurritoReviewModel[];
}

function Header(props: Props) {
  const { burritos } = props;

  const restaurantsVisited = burritos.length;

  const totalBurritosEaten = burritos
    .map((burrito) => burrito.count ?? 0)
    .reduce((a, b) => a + b, 0);

  const totalCaloriesEaten = totalBurritosEaten * 1200;

  const regrets: number = burritos
    .map((burrito) => (burrito.rating < 1.5 ? 1 : (0 as number)))
    .reduce((a, b) => a + b, 0);

  return (
    <div className={styles.container}>
      <div className="text-center my-12">
        <h1 className="sm:text-8xl text-6xl">Kyle&apos;s Burrito Map</h1>
      </div>
      <div className="flex w-full justify-center text-center flex-wrap gap-y-8 px-8 my-12">
        <div className="w-1/2">
          <BigNumber num={totalBurritosEaten} subtitle="Burritos Eaten" />
        </div>
        <div className="w-1/2">
          <BigNumber num={totalCaloriesEaten} subtitle="Calories Consumed" />
        </div>
        <div className="w-1/2">
          <BigNumber num={restaurantsVisited} subtitle="Restaurants Visited" />
        </div>
        <div className="w-1/2">
          <BigNumber num={regrets} subtitle="Regrets" />
        </div>
      </div>
      <div className="pr-4">
        <p>Hey! I&apos;m Kyle, and my hobby is eating burritos</p>
        <p>Ratings are based on flavor alone.</p>
      </div>
    </div>
  );
}

export default Header;
