/*
This module is a utility for turning text into polygons on the geographic
coordinate system.
*/

import { Position } from "geojson";

import opentype, { Path } from "opentype.js";

const font = opentype.loadSync("./private/Geist.ttf");

export function textToPolygon(
  text: string,
  center: Position,
  height: number,
): Position[][] {
  const path = font.getPath(text, center[0], center[1], height);
  const polygons = pathToPolygon(path);
  reflectYAxis(polygons);
  return polygons;
}

function pathToPolygon(path: Path): Position[][] {
  const output: Position[][] = [];
  // As we process the commands, we build a polygon. It'll be built in here.
  let currentPolygon: Position[] = [];
  for (const command of path.commands) {
    switch (command.type) {
      case "M":
        if (currentPolygon.length > 0) {
          output.push(currentPolygon);
        }
        const startingPoint = [command.x, command.y] as Position;
        currentPolygon = [startingPoint];
        break;
      case "L":
        const newPoint = [command.x, command.y] as Position;
        currentPolygon.push(newPoint);
        break;
      case "Q":
        const start = currentPolygon[currentPolygon.length - 1];
        const control = [command.x1, command.y1] as Position;
        const end = [command.x, command.y] as Position;
        const newPoints = sampleQuadraticBezierCurve(start, control, end);
        currentPolygon.push(...newPoints);
        break;
      case "Z":
        if (currentPolygon.length > 0) {
          output.push(currentPolygon);
        }
        currentPolygon = [];
        break;
      default:
        throw new Error("Unimplemented command" + command.type);
    }
  }
  return output;
}

function sampleQuadraticBezierCurve(
  start: Position,
  control: Position,
  end: Position,
  samples: number = 10,
): Position[] {
  const output: Position[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x =
      (1 - t) * (1 - t) * start[0] +
      2 * (1 - t) * t * control[0] +
      t * t * end[0];
    const y =
      (1 - t) * (1 - t) * start[1] +
      2 * (1 - t) * t * control[1] +
      t * t * end[1];
    output.push([x, y]);
  }
  return output;
}

function reflectYAxis(polygons: Position[][]) {
  for (const polygon of polygons) {
    for (let i = 0; i < polygon.length; i++) {
      polygon[i][1] = -polygon[i][1] + 90;
    }
  }
}
