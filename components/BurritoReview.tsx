import React from "react";

import styles from "./BurritoReview.module.scss";
import { BurritoReviewModel } from "../app/types";

export interface Props {
  burrito: BurritoReviewModel;
}

function BurritoReview(props: Props) {
  const { burrito } = props;
  return (
    <div className={`${styles.container} border-t border-black py-4`}>
      <div className="pb-4 font-mono">
        <h2 className={`text-2xl/7 line uppercase font-bold pb-2`}>
          {burrito.name}
        </h2>
        <div className="text-xs">
          <div>
            <time>{burrito.date}</time>
          </div>
          <div>
            {(burrito.count ?? 0) <= 1
              ? "1 burrito eaten here"
              : burrito.count + " burritos eaten here"}
          </div>
          {burrito.order ? (
            <div>
              <span>Order: </span>
              {burrito.order}
            </div>
          ) : (
            ""
          )}
          <div>
            <span>Rating: </span>
            {burrito.rating}/5 stars
          </div>
        </div>
      </div>
      <div
        className={styles.reviewBody + " pr-2 text-xs font-sans"}
        dangerouslySetInnerHTML={{ __html: burrito.description ?? "" }}
      ></div>
    </div>
  );
}

export default BurritoReview;
