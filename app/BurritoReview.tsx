import React from "react";

import styles from "./BurritoReview.module.scss";

function BurritoReview(props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.restaurantName}>{props.burrito.name}</h2>
      <p>{props.burrito.description}</p>
    </div>
  );
}

export default BurritoReview;
