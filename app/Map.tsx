"use client";

import React, { Component } from "react";
import { renderToString } from "react-dom/server";

import mapboxgl, { Marker, LngLat } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Position } from "geojson";

import styles from "./Map.module.scss";
import { BurritoReviewModel } from "./types";
import { createMarker } from "@/components/Marker";
import { onMobile } from "./util";
import BurritoReview from "@/components/BurritoReview";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Props {
  burritos: BurritoReviewModel[];
  drawing: Position[][][]; // List of polygons to draw on the globe
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
    const { burritos, drawing } = this.props as Props;

    const map = new mapboxgl.Map({
      container: "map",
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE,
      center: [-99.7129, 40.0902],
      zoom: onMobile() ? 2 : 4,
      minZoom: 2,
    });
    this.map = map;

    this.markers = burritos.map((burrito: BurritoReviewModel) => {
      const marker = createMarker({ burrito });
      const popupHTML = renderToString(<BurritoReview burrito={burrito} />);
      const popup = new mapboxgl.Popup()
        .setLngLat(marker.getLngLat())
        .setHTML(popupHTML)
        .addTo(map);
      marker.setPopup(popup);
      return marker;
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

    map.on("click", (e) => {
      const clickPos = e.lngLat;
      const closestMarkerIndex = this.findClosestMarker(clickPos);

      if (closestMarkerIndex != null) {
        this.setState({ focusedEntry: closestMarkerIndex });
      }
    });

    map.on("load", () => {
      for (let i = 0; i < drawing.length; i++) {
        const id = `polygon-${i}`;
        const polygon = drawing[i];
        map.addSource(id, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: polygon,
            },
            properties: {},
          },
        });

        map.addLayer({
          id: id,
          type: "fill",
          source: id,
          layout: {},
          paint: {
            "fill-color": "#000",
            "fill-opacity": 1,
          },
        });
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
