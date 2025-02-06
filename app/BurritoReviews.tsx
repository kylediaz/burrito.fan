import React, { Dispatch, SetStateAction } from "react";
import { BurritoReviewModel } from "./types";
import Header from "@/components/Header";
import BurritoReview from "@/components/BurritoReview";

export interface Props {
  burritos: BurritoReviewModel[];
  focusedEntry: number;
  setFocusedEntry: Dispatch<SetStateAction<number>>;
}

function BurritoReviews(props: Props) {
  const { burritos, focusedEntry, setFocusedEntry } = props;

  return (
    <div>
      <Header burritos={burritos} />
      <ul>
        {burritos.map((burrito, index) => (
          <li key={index} id={`burrito-review-${index}`}>
            <BurritoReview
              burrito={burrito}
              isFocused={focusedEntry == index}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BurritoReviews;
