import React from "react";

import styles from "./BurritoReview.module.scss";
import { BurritoReviewModel } from "../app/types";

const Rating = ({ number }: { number: number }) => {
  return (
    <div className="flex items-center space-x-1 bg-black text-white px-3 py-2">
      <span className="text-2xl font-bold">{Math.floor(number)}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
      </svg>
    </div>
  );
};

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
