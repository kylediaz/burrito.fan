/*
This module is a utility for turning text into polygons on the geographic
coordinate system.
*/

import { Position } from "geojson";

import opentype, { Path } from "opentype.js";

const font = opentype.loadSync("./public/SpaceMono-Regular.ttf");

export function bigOverSmallText(
  bigText: string,
  smallText: string,
  pos: Position,
  bigSize: number,
  smallSize: number,
  fontHeightToWidthRatio: number,
  spacing: number = 0,
): Position[][][] {
  const bigTextCharWidth = bigSize / fontHeightToWidthRatio;
  const bigTextLength = bigText.length * bigTextCharWidth;
  const smallTextCharWidth = smallSize / fontHeightToWidthRatio;
  const smallTextLength = smallText.length * smallTextCharWidth;
  const differenceInLength = bigTextLength - smallTextLength;
  const bigPos = [
    pos[0] - differenceInLength / 2,
    pos[1] + smallSize + spacing,
  ];
  return [
    ...textToPolygonMono(bigText, bigPos, bigSize, bigTextCharWidth),
    ...textToPolygonMono(smallText, pos, smallSize, smallTextCharWidth),
  ];
}

export function textToPolygon(
  text: string,
  pos: Position,
  height: number,
): Position[][] {
  const path = font.getPath(text, pos[0], pos[1], height);
  const polygons = pathToPolygon(path);
  reflectYAxis(polygons, pos[1]);
  return polygons;
}

/*
Better function designed to work with monospaced fonts.
Returns an array of polygons, one for each character.
*/
export function textToPolygonMono(
  text: string,
  pos: Position,
  height: number,
  dx: number, // Depends on the font
): Position[][][] {
  const polygons = [];
  let x = pos[0];
  for (const c of text) {
    if (c !== " ") {
      const path = font.getPath(c, x, pos[1], height);
      const polygon = pathToPolygon(path);
      polygons.push(polygon);
    }
    x += dx;
  }
  for (const polygon of polygons) {
    reflectYAxis(polygon, pos[1]);
  }
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

function reflectYAxis(polygons: Position[][], y: number) {
  for (const polygon of polygons) {
    for (let i = 0; i < polygon.length; i++) {
      polygon[i][1] = y + -(polygon[i][1] - y);
    }
  }
}
