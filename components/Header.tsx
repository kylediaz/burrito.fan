import React from "react";

import Image from "next/image";

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

  return (
    <div className={styles.container}>
      <div className="text-center">
        <h1 className="text-8xl">Kyle&apos;s Burrito Map</h1>
      </div>
      <div className="flex w-full justify-center text-center flex-wrap p-8">
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
          <BigNumber num={0} subtitle="Regrets" />
        </div>
      </div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
        fermentum sodales lobortis. Sed feugiat, mi nec mollis sagittis, nisi
        lacus tempor ex, vitae condimentum justo risus quis lacus. Morbi
        lobortis leo malesuada, semper arcu in, accumsan dolor. Class aptent
        taciti sociosqu ad litora torquent per conubia nostra, per inceptos
        himenaeos. Integer laoreet condimentum nunc et pharetra. Proin quis est
        nec odio posuere tincidunt a tincidunt risus. Etiam in metus mollis,
        scelerisque leo sit amet, scelerisque ipsum. Fusce eu fermentum nisl.
        Proin et felis ante. Curabitur molestie arcu vehicula ullamcorper
        porttitor. In ac vehicula mi, vitae lacinia libero. Cras dapibus
        placerat dolor eu facilisis. Integer et lacus arcu. Donec quam orci,
        tincidunt id libero et, pretium pellentesque urna. Quisque quis
        vestibulum lectus. Vivamus volutpat dapibus ornare.
        <p>Ratings are based on flavor alone.</p>
      </div>
    </div>
  );
}

export default Header;
