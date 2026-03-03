import type { Rectangle } from "../interfaces/working-area-interface";

export type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'right' | 'bottom' | 'left' | null;

export function getResizeHandle(
  x: number,
  y: number,
  rect: Rectangle,
  tolerance = 6
): ResizeHandle {
  const rx = rect.width < 0 ? rect.x + rect.width : rect.x;
  const ry = rect.height < 0 ? rect.y + rect.height : rect.y;
  const rw = Math.abs(rect.width);
  const rh = Math.abs(rect.height);

  const cornerTolerance = tolerance * 1.5;
  
  const topLeft = Math.abs(x - rx) <= cornerTolerance && Math.abs(y - ry) <= cornerTolerance;
  const topRight = Math.abs(x - (rx + rw)) <= cornerTolerance && Math.abs(y - ry) <= cornerTolerance;
  const bottomLeft = Math.abs(x - rx) <= cornerTolerance && Math.abs(y - (ry + rh)) <= cornerTolerance;
  const bottomRight = Math.abs(x - (rx + rw)) <= cornerTolerance && Math.abs(y - (ry + rh)) <= cornerTolerance;

  if (topLeft) return 'top-left';
  if (topRight) return 'top-right';
  if (bottomLeft) return 'bottom-left';
  if (bottomRight) return 'bottom-right';

  const onLeft = Math.abs(x - rx) <= tolerance && y >= ry && y <= ry + rh;
  const onRight = Math.abs(x - (rx + rw)) <= tolerance && y >= ry && y <= ry + rh;
  const onTop = Math.abs(y - ry) <= tolerance && x >= rx && x <= rx + rw;
  const onBottom = Math.abs(y - (ry + rh)) <= tolerance && x >= rx && x <= rx + rw;

  if (onLeft) return 'left';
  if (onRight) return 'right';
  if (onTop) return 'top';
  if (onBottom) return 'bottom';

  return null;
}

export function getCursorForHandle(handle: ResizeHandle): string {
  switch (handle) {
    case 'top-left':
    case 'bottom-right':
      return 'nwse-resize';
    case 'top-right':
    case 'bottom-left':
      return 'nesw-resize';
    case 'top':
    case 'bottom':
      return 'ns-resize';
    case 'left':
    case 'right':
      return 'ew-resize';
    default:
      return 'default';
  }
}
