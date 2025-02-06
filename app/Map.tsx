"use client";

import React, { SetStateAction, Dispatch, Component } from "react";

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

class Map extends Component {
  markers: Marker[] = [];
  map: mapboxgl.Map | null = null;

  componentDidMount() {
    const { burritos, setFocusedEntry } = this.props as Props;

    this.markers = burritos.map((burrito: BurritoReviewModel) => {
      return new mapboxgl.Marker({
        rotationAlignment: "horizon",
        clickTolerance: 1,
      }).setLngLat([burrito.long, burrito.lat]);
    });

    this.map = new mapboxgl.Map({
      container: "map",
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE,
      center: [-99.7129, 40.0902],
      zoom: onMobile() ? 2 : 3,
      minZoom: 2,
    });

    this.markers
      // Sort so further markers are rendered behind nearer markers
      .toSorted(
        (a: mapboxgl.Marker, b: mapboxgl.Marker) =>
          b.getLngLat().lat - a.getLngLat().lat,
      )
      .forEach((marker: mapboxgl.Marker) => {
        if (this.map != null) {
          marker.addTo(this.map);
        }
      });

    this.map.on("click", (e) => {
      const clickPos = e.lngLat;
      const closestMarkerIndex = this.findClosestMarker(clickPos);

      if (closestMarkerIndex != null) {
        setFocusedEntry(closestMarkerIndex);
      }
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.focusedEntry !== prevProps.focusedEntry) {
      this.focusOnNewMarker(this.props.focusedEntry);
    }
  }

  render() {
    return (
      <section className={styles.mapContainer}>
        <div className={`${styles.mapStyle} mapboxgl-map`} id="map" />
      </section>
    );
  }

  focusOnNewMarker(idx: number) {
    const validIdx = 0 <= idx && idx < this.markers.length;
    if (!validIdx || this.map == null) {
      return;
    }

    const marker = this.markers[idx];
    const distanceToTarget = this.map
      .getCenter()
      .distanceTo(marker.getLngLat());
    this.map.flyTo({
      center: marker.getLngLat(),
      zoom: Math.max(13.5, this.map.getZoom()),
      duration: Math.min(1000 + distanceToTarget / 100, 7_000),
    });
  }

  findClosestMarker(clickPos: LngLat): number | null {
    let closestMarkerIndex = null;
    let closestDistance = Infinity;
    for (let i = 0; i < this.markers.length; i++) {
      const distance = clickPos.distanceTo(this.markers[i].getLngLat());
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMarkerIndex = i;
      }
    }
    return closestMarkerIndex;
  }
}

export interface Props {
  burritos: BurritoReviewModel[];
  focusedEntry: number;
  setFocusedEntry: Dispatch<SetStateAction<number>>;
}

export default Map;
