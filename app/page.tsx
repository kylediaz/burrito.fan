"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useRef, useState } from "react";

import styles from "./Page.module.scss";
import burritos from "./burritos.json";
import BurritoReview from "./BurritoReview";
import Header from "./Header";

function clamp(num: number, min: number, max: number): number {
  return num <= min ? min : num >= max ? max : num;
}

burritos.sort((a, b) => {
  if (a.date == undefined) {
    return 1;
  } else if (b.date == undefined) {
    return -1;
  } else {
    return -a.date.localeCompare(b.date);
  }
});

const markers = burritos.map((burrito) => {
  return new mapboxgl.Marker({
    rotationAlignment: "horizon",
    clickTolerance: 1,
  }).setLngLat([burrito.long, burrito.lat]);
});

export default function Home() {
  const mapElement = useRef<string | HTMLElement>("");
  const map = useRef<mapboxgl.Map>(null);

  const [currentMarker, setCurrentMarker] = useState(-1);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapElement.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE,
      center: [-99.7129, 40.0902],
      zoom: 3,
      minZoom: 2,
    });

    markers
      // Sort so further markers are rendered behind nearer markers
      .sort((a, b) => b.getLngLat().lat - a.getLngLat().lat)
      .forEach((marker) => {
        if (map.current != null) {
          marker.addTo(map.current);
        }
      });

    map.current.on("click", (e) => {
      if (map.current != null) {
        const clickPos = e.lngLat;
        const threshold = clamp(50_000 / map.current.getZoom(), 10, 100_000);

        let closestMarker: mapboxgl.Marker | null = null;
        let closestMarkerIndex = -1;
        let closestDistance = Infinity;
        for (const index in markers) {
          const marker = markers[index];
          const distance = clickPos.distanceTo(marker.getLngLat());
          if (distance < threshold && distance < closestDistance) {
            closestMarker = marker;
            closestMarkerIndex = parseInt(index);
            closestDistance = distance;
          }
        }

        if (closestMarker instanceof mapboxgl.Marker) {
          const element = document.getElementById(
            `burrito-review-${closestMarkerIndex}`,
          );
          element?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });

          const distanceToTarget = map.current
            .getCenter()
            .distanceTo(closestMarker.getLngLat());
          map.current?.flyTo({
            center: closestMarker.getLngLat(),
            zoom: Math.max(13.5, map.current.getZoom()),
            duration: Math.min(1000 + distanceToTarget / 100, 7_000),
          });
        }
      }
    });
  }, []);

  return (
    <div>
      <header className={styles.header}>burrito.fan</header>
      <div className={styles.mainContainer}>
        <section id="map" className={`${styles.mapContainer}`}>
          <div className={`${styles.mapStyle} mapboxgl-map`} ref={mapElement} />
        </section>
        <section
          className={`${styles.reviewsContainer} sm:w-1/2 w-full h-2/3 sm:h-full`}
        >
          <main>
            <Header burritos={burritos} />
            <ul>
              {burritos.map((burrito, index) => (
                <li key={index} id={`burrito-review-${index}`}>
                  <BurritoReview burrito={burrito} index={index} />
                </li>
              ))}
            </ul>
          </main>
        </section>
      </div>
    </div>
  );
}
