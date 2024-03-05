import { Coord } from "../domain/Coord";

export function distanceBetweenPoints(A: Coord, B: Coord) {
  const R = 6371;
  const φ1 = (A.lat * Math.PI) / 180;
  const φ2 = (B.lat * Math.PI) / 180;
  const Δφ = ((B.lat - A.lat) * Math.PI) / 180;
  const Δλ = ((B.long - A.long) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.abs(distance);
}
