"use client";

import mapboxgl from "mapbox-gl";

import styles from "./Marker.module.scss";
import { BurritoReviewModel } from "../app/types";

/*
Note that this is not a react component.
*/
export function createMarker({ burrito }: { burrito: BurritoReviewModel }) {
  const size = 48;
  const container = document.createElement("div");
  container.className = styles.markerContainer;

  const marker = document.createElement("div");
  marker.classList.add(styles.marker);
  container.appendChild(marker);

  return new mapboxgl.Marker({
    element: container,
    offset: [0, -size / 2],
    clickTolerance: 1,
    rotationAlignment: "horizon",
  }).setLngLat([burrito.long, burrito.lat]);
}
