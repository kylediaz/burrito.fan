"use client";

import React, {
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
  useMemo,
} from "react";

import mapboxgl, { Marker, LngLat } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import styles from "./Map.module.scss";
import { BurritoReviewModel } from "./types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function clamp(num: number, min: number, max: number): number {
  return num <= min ? min : num >= max ? max : num;
}

function onMobile(): boolean {
  return window.innerWidth < 900;
}

function findClosestMarkerToPoint(
  markers: Marker[],
  point: LngLat,
): number | null {
  //const threshold = clamp(50_000 / map.current.getZoom(), 10, 100_000);
  const threshold = 100_000;

  let closestMarkerIndex: number | null = null;
  let closestDistance = Infinity;
  for (const index in markers) {
    const marker = markers[index];
    const distance = point.distanceTo(marker.getLngLat());
    if (distance < threshold && distance < closestDistance) {
      closestMarkerIndex = parseInt(index);
      closestDistance = distance;
    }
  }
  return closestMarkerIndex;
}

export interface Props {
  burritos: BurritoReviewModel[];
  focusedEntry: number;
  setFocusedEntry: Dispatch<SetStateAction<number>>;
}

const Map = (props: Props) => {
  const { burritos, focusedEntry, setFocusedEntry } = props;

  const mapContainerRef: React.RefObject<HTMLDivElement | null> = useRef(null);
  const mapRef: React.RefObject<mapboxgl.Map | null> = useRef(null);
  const markersRef: React.RefObject<Marker[]> = useRef([]);

  function focusOnNewMarker(idx: number) {
    const map = mapRef.current;
    const markers = markersRef.current;
    const validIdx = 0 <= idx && idx < markers.length;
    if (!validIdx || map == null) {
      return;
    }

    const marker = markers[idx];
    const distanceToTarget = map.getCenter().distanceTo(marker.getLngLat());
    map.flyTo({
      center: marker.getLngLat(),
      zoom: Math.max(13.5, map.getZoom()),
      duration: Math.min(1000 + distanceToTarget / 100, 7_000),
    });
  }

  useEffect(() => {
    const markers = burritos.map((burrito) => {
      return new mapboxgl.Marker({
        rotationAlignment: "horizon",
        clickTolerance: 1,
      }).setLngLat([burrito.long, burrito.lat]);
    });
    markersRef.current = markers;

    console.log("fortnite", mapContainerRef);
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE,
      center: [-99.7129, 40.0902],
      zoom: onMobile() ? 2 : 3,
      minZoom: 2,
    });
    mapRef.current = map;

    markers
      // Sort so further markers are rendered behind nearer markers
      .toSorted(
        (a: mapboxgl.Marker, b: mapboxgl.Marker) =>
          b.getLngLat().lat - a.getLngLat().lat,
      )
      .forEach((marker: mapboxgl.Marker) => {
        if (map != null) {
          marker.addTo(map);
        }
      });

    map.on("click", (e) => {
      const clickPos = e.lngLat;
      const closestMarkerIndex = findClosestMarkerToPoint(markers, clickPos);

      if (closestMarkerIndex == null) {
        return;
      }

      const element = document.getElementById(
        `burrito-review-${closestMarkerIndex}`,
      );
      element?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });

      setFocusedEntry(closestMarkerIndex);
    });
  });

  useEffect(() => focusOnNewMarker(focusedEntry), [focusedEntry]);

  return (
    <div className={`${styles.mapStyle} mapboxgl-map`} ref={mapContainerRef} />
  );
};

export default Map;
