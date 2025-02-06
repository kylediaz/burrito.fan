export type BurritoReviewModel = {
  long: number;
  lat: number;
  name: string;
  date: string;
  order: string | undefined;
  count: number | undefined;
  rating: number;
  description: string | undefined;
};

export type FocusedEntry = {
  idx: number;
  source: "map" | "scroll" | "click" | "none";
};

export const DefaultFocusedEntry = {
  idx: -1,
  source: "none",
};
