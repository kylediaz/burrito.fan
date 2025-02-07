"use client";

import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  RefObject,
  useState,
} from "react";
import { BurritoReviewModel, FocusedEntry } from "./types";
import Header from "@/components/Header";
import BurritoReview from "@/components/BurritoReview";

import styles from "./BurritoReviews.module.scss";

function BurritoReviews(props: Props) {
  const { burritos, focusedEntry, setFocusedEntry } = props;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ignoreScroll, setIgnoreScroll] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const containerRef: RefObject<HTMLDivElement | null> = useRef(null);

  const reviewElementsRefs = new Array<RefObject<HTMLElement | null>>(
    burritos.length,
  );
  const reviewElements = new Array<React.JSX.Element>(burritos.length);
  for (let index = 0; index < burritos.length; index++) {
    const burrito = burritos[index];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref: RefObject<HTMLLIElement | null> = useRef<HTMLLIElement>(null);
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

  const handleScroll = () => {
    if (ignoreScroll || containerRef.current == null) {
      return;
    }

    const containerHeight = containerRef.current.getBoundingClientRect().height;
    let closestEntry = -1;
    let closestDistanceToCenter = Infinity;
    for (let index = 0; index < burritos.length; index++) {
      const ref = reviewElementsRefs[index];
      if (ref.current == null) {
        continue;
      }
      const rect = ref.current.getBoundingClientRect();
      const rectCenter = (rect.top + rect.bottom) / 2;

      const distanceToCenter = Math.abs(rectCenter - containerHeight / 2);
      if (
        distanceToCenter < closestDistanceToCenter &&
        distanceToCenter < 300
      ) {
        closestEntry = index;
        closestDistanceToCenter = distanceToCenter;
      }
    }
    setFocusedEntry({ idx: closestEntry, source: "scroll" });
  };

  useEffect(() => {
    if (
      document == undefined ||
      focusedEntry.source == "scroll" ||
      focusedEntry.idx < 0
    ) {
      return;
    }
    if (focusedEntry.source == "map") {
      setIgnoreScroll(true);
    }
    const element = document.getElementById(
      `burrito-review-${focusedEntry.idx}`,
    );
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [focusedEntry]);

  return (
    <div
      ref={containerRef}
      className={styles.outerContainer + " mx-2"}
      onScroll={handleScroll}
      onWheel={() => setIgnoreScroll(false)}
      onTouchStart={() => setIgnoreScroll(false)}
    >
      <div id="reviews" className={styles.innerContainer}>
        <Header burritos={burritos} />
        <ul>{reviewElements}</ul>
      </div>
      <footer
        className="flex flex-col justify-center items-center"
        style={{ height: "40vh" }}
      >
        <div>Thanks for reading :)</div>
        <div>
          <a href="#reviews">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

export interface Props {
  burritos: BurritoReviewModel[];
  focusedEntry: FocusedEntry;
  setFocusedEntry: Dispatch<SetStateAction<FocusedEntry>>;
}

export default BurritoReviews;
