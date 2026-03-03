import type { Rectangle } from "../interfaces/working-area-interface";
import type { ResizeHandle } from "./getResizeHandle";

export function resizeRectangle(
  rect: Rectangle,
  x: number,
  y: number,
  handle: ResizeHandle
): Rectangle {
  const newRect = { ...rect };

  switch (handle) {
    case 'top-left':
      newRect.width = rect.x + rect.width - x;
      newRect.height = rect.y + rect.height - y;
      newRect.x = x;
      newRect.y = y;
      break;
    case 'top-right':
      newRect.width = x - rect.x;
      newRect.height = rect.y + rect.height - y;
      newRect.y = y;
      break;
    case 'bottom-left':
      newRect.width = rect.x + rect.width - x;
      newRect.height = y - rect.y;
      newRect.x = x;
      break;
    case 'bottom-right':
      newRect.width = x - rect.x;
      newRect.height = y - rect.y;
      break;
    case 'top':
      newRect.height = rect.y + rect.height - y;
      newRect.y = y;
      break;
    case 'right':
      newRect.width = x - rect.x;
      break;
    case 'bottom':
      newRect.height = y - rect.y;
      break;
    case 'left':
      newRect.width = rect.x + rect.width - x;
      newRect.x = x;
      break;
  }

  return newRect;
}
