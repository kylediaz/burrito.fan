"use client";

import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  RefObject,
} from "react";
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

  const reviewElementsRefs = new Array<RefObject<HTMLElement>>(burritos.length);
  const reviewElements = new Array<React.JSX.Element>(burritos.length);
  for (let index = 0; index < burritos.length; index++) {
    const burrito = burritos[index];
    const ref = useRef();
    reviewElementsRefs[index] = ref;
    reviewElements[index] = (
      <li key={index} id={`burrito-review-${index}`} ref={ref}>
        <BurritoReview burrito={burrito} isFocused={focusedEntry == index} />
      </li>
    );
  }

  useEffect(() => {
    reviewElementsRefs.forEach((ref, index) => {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        console.log(entry.intersectionRatio);
        if (entry.isIntersecting) {
          setFocusedEntry(index);
        }
      });
      observer.observe(ref.current);
    });
  }, []);

  useEffect(() => {
    if (document != undefined) {
      const element = document.getElementById(`burrito-review-${focusedEntry}`);
      element?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [focusedEntry]);

  return (
    <div>
      <Header burritos={burritos} />
      <ul>{reviewElements}</ul>
    </div>
  );
}

export default BurritoReviews;
