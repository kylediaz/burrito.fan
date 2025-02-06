"use client";

import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  RefObject,
} from "react";
import { BurritoReviewModel, FocusedEntry } from "./types";
import Header from "@/components/Header";
import BurritoReview from "@/components/BurritoReview";

import styles from "./BurritoReviews.module.scss";

function BurritoReviews(props: Props) {
  const { burritos, focusedEntry, setFocusedEntry } = props;

  const reviewElementsRefs = new Array<RefObject<HTMLElement>>(burritos.length);
  const reviewElements = new Array<React.JSX.Element>(burritos.length);
  for (let index = 0; index < burritos.length; index++) {
    const burrito = burritos[index];
    const ref: RefObject<HTMLElement> = useRef(null);
    reviewElementsRefs[index] = ref;
    reviewElements[index] = (
      <li key={index} id={`burrito-review-${index}`} ref={ref}>
        <BurritoReview
          burrito={burrito}
          isFocused={focusedEntry.idx == index}
        />
      </li>
    );
  }

  const handleScroll = (e) => {
    console.log("scroll");
    for (let index = 0; index < burritos.length; index++) {
      const ref = reviewElementsRefs[index];
      const rect = ref.current.getBoundingClientRect();
      const middle = window.innerHeight / 2;
      const inMiddle = Math.abs(rect.top - (middle - rect.height / 2)) < 5;
      if (inMiddle && focusedEntry.idx != index) {
        setFocusedEntry({ idx: index, source: "scroll" });
      }
    }
  };

  useEffect(() => {
    if (
      document == undefined ||
      focusedEntry.source == "scroll" ||
      focusedEntry.idx < 0
    ) {
      return;
    }
    const element = document.getElementById(
      `burrito-review-${focusedEntry.idx}`,
    );
    element?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [focusedEntry]);

  return (
    <div className={styles.outerContainer} onScroll={handleScroll}>
      <div className={styles.innerContainer}>
        <Header burritos={burritos} />
        <ul>{reviewElements}</ul>
      </div>
    </div>
  );
}

export interface Props {
  burritos: BurritoReviewModel[];
  focusedEntry: FocusedEntry;
  setFocusedEntry: Dispatch<SetStateAction<FocusedEntry>>;
}

export default BurritoReviews;
