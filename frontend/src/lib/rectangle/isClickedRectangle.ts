import type { Rectangle } from "../interfaces/working-area-interface";

export function isPointOnRectBorder(
  x: number,
  y: number,
  rect: Rectangle,
  tolerance = 6
) {
  const rx = rect.width < 0 ? rect.x + rect.width : rect.x;
  const ry = rect.height < 0 ? rect.y + rect.height : rect.y;
  const rw = Math.abs(rect.width);
  const rh = Math.abs(rect.height);

  const onLeft   = Math.abs(x - rx) <= tolerance && y >= ry && y <= ry + rh;
  const onRight  = Math.abs(x - (rx + rw)) <= tolerance && y >= ry && y <= ry + rh;
  const onTop    = Math.abs(y - ry) <= tolerance && x >= rx && x <= rx + rw;
  const onBottom = Math.abs(y - (ry + rh)) <= tolerance && x >= rx && x <= rx + rw;

  return onLeft || onRight || onTop || onBottom;
}