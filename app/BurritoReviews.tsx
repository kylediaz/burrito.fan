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

  const element = document.getElementById(`burrito-review-${focusedEntry}`);
  element?.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });

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
