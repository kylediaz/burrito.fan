"use client";

import React, { Component } from "react";

import mapboxgl, { Marker, LngLat } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import styles from "./Map.module.scss";
import { BurritoReviewModel } from "./types";
import { createMarker } from "../components/Marker";
import { onMobile } from "./util";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Props {
  burritos: BurritoReviewModel[];
}

class Map extends Component<Props> {
  markers: Marker[] = [];
  map: mapboxgl.Map | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      focusedEntry: -1,
    };
  }

  componentDidMount() {
    const { burritos } = this.props as Props;

    this.markers = burritos.map((burrito: BurritoReviewModel) =>
      createMarker({ burrito }),
    );

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
        this.setState({ focusedEntry: closestMarkerIndex });
      }
    });
  }

  render() {
    return (
      <div className={styles.mapContainer}>
        <div className={`${styles.mapStyle} mapboxgl-map`} id="map" />
      </div>
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

    const target = {
      center: marker.getLngLat(),
      zoom: Math.max(13.5, this.map.getZoom()),
      duration: Math.min(1000 + distanceToTarget / 100, 7_000),
    };

    if (distanceToTarget > 10_000) {
      this.map.flyTo(target);
    } else {
      this.map.easeTo(target);
    }
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

export default Map;
