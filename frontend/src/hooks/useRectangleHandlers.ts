import { useRef, useState } from "react";
import type { Rectangle } from "@/lib/interfaces/working-area-interface";
import { getResizeHandle, getCursorForHandle, type ResizeHandle } from "@/lib/rectangle/getResizeHandle";
import { resizeRectangle } from "@/lib/rectangle/resizeRectangle";
import { getCanvasCoords } from "@/lib/canvas-events";
import type { Camera } from "@/lib/canvas-events";

export function useRectangleHandlers() {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [isDrawingRect, setIsDrawingRect] = useState(false);
  const [selectedRectId, setSelectedRectId] = useState<number | null>(null);
  const [isMovingRect, setIsMovingRect] = useState(false);
  const [isResizingRect, setIsResizingRect] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [currentCursor, setCurrentCursor] = useState<string>('default');
  
  const startPoint = useRef({ x: 0, y: 0 });
  const nextIdRef = useRef(0);

  const handleRectangleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    camera: Camera,
    rectangle: boolean,
    grabber: boolean
  ) => {
    const coords = getCanvasCoords(e, canvasRef, camera);
    if (!coords) return;
    const { x, y } = coords;

    if (!rectangle && !grabber) {
      for (let i = rectangles.length - 1; i >= 0; i--) {
        const r = rectangles[i];
        const handle = getResizeHandle(x, y, r);
        
        if (handle) {
          setSelectedRectId(r.id);
          setIsResizingRect(true);
          setResizeHandle(handle);
          startPoint.current = { x, y };
          return;
        }
        
        if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) {
          setSelectedRectId(r.id);
          setIsMovingRect(true);
          startPoint.current = { x, y };
          return;
        }
      }

      setSelectedRectId(null);
    }
  };

  const handleRectangleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    camera: Camera,
    isDragging: boolean,
    isDrawingRect: boolean,
    textBoxes: any[]
  ) => {
    const coords = getCanvasCoords(e, canvasRef, camera);
    if (!coords) return;
    const { x, y } = coords;

    if (!isDragging && !isMovingRect && !isResizingRect && !isDrawingRect) {
      let newCursor = 'default';
      
      for (let i = rectangles.length - 1; i >= 0; i--) {
        const rect = rectangles[i];
        const handle = getResizeHandle(x, y, rect);
        if (handle) {
          newCursor = getCursorForHandle(handle);
          break;
        }
      }
      
      if (newCursor === 'default') {
        for (const textBox of textBoxes) {
          const textWidth = 100;
          const textHeight = 20; 
          if (x >= textBox.x && x <= textBox.x + textWidth &&
              y >= textBox.y && y <= textBox.y + textHeight) {
            newCursor = 'text';
            break;
          }
        }
      }
      
      if (newCursor !== currentCursor) {
        setCurrentCursor(newCursor);
      }
    }

    if (isResizingRect && selectedRectId !== null && resizeHandle) {
      setRectangles(prev =>
        prev.map(rect =>
          rect.id === selectedRectId
            ? resizeRectangle(rect, x, y, resizeHandle)
            : rect
        )
      );
      return;
    }

    if (isMovingRect && selectedRectId !== null) {
      const dx = x - startPoint.current.x;
      const dy = y - startPoint.current.y;

      setRectangles(prev =>
        prev.map(rect =>
          rect.id === selectedRectId
            ? { ...rect, x: rect.x + dx, y: rect.y + dy }
            : rect
        )
      );

      startPoint.current = { x, y };
      return;
    }

    if (isDrawingRect) {
      setRectangles(prev => {
        const updated = [...prev];
        const current = updated[updated.length - 1];

        current.width = x - startPoint.current.x;
        current.height = y - startPoint.current.y;

        return updated;
      });
      return;
    }
  };

  const handleRectangleMouseUp = () => {
    setIsDrawingRect(false);
    setIsMovingRect(false);
    setIsResizingRect(false);
    setResizeHandle(null);
  };

  const startDrawingRect = (
    x: number, 
    y: number, 
    setIsDrawingRect: (value: boolean) => void
  ) => {
    setIsDrawingRect(true);
    startPoint.current = { x, y };

    const newId = nextIdRef.current++;

    setRectangles(prev => [
      ...prev,
      { id: newId, x, y, width: 0, height: 0, stroke: "#000000" }
    ]);
  };

  return {
    rectangles,
    setRectangles,
    isDrawingRect,
    setIsDrawingRect,
    selectedRectId,
    setSelectedRectId,
    isMovingRect,
    isResizingRect,
    resizeHandle,
    currentCursor,
    startPoint,
    nextIdRef,
    handleRectangleMouseDown,
    handleRectangleMouseMove,
    handleRectangleMouseUp,
    startDrawingRect
  };
}
