import React from "react";

import styles from "./BurritoReview.module.scss";
import { BurritoReviewModel } from "../app/types";

export interface Props {
  burrito: BurritoReviewModel;
  isFocused: boolean;
}

function BurritoReview(props: Props) {
  const { burrito } = props;
  return (
    <div
      className={`${styles.container} ${props.isFocused ? styles.focused : ""}`}
    >
      <h2 className={styles.restaurantName}>{burrito.name}</h2>
      <small>
        {burrito.order}, {burrito.count}
      </small>
      <p>{burrito.description}</p>
    </div>
  );
}

export default BurritoReview;
