import { useRef, useState } from "react";
import type { Camera } from "@/lib/canvas-events";
import type { TextBox } from "@/lib/interfaces/working-area-interface";

export function useCameraHandlers() {
  const [isDragging, setIsDragging] = useState(false);
  const [camera, setCamera] = useState<Camera>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    zoom: 1,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const handleCameraMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, grabber: boolean) => {
    if (grabber) {
      dragging.current = true;
      setIsDragging(true);
      last.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleCameraMouseMove = (e: React.MouseEvent<HTMLCanvasElement>, grabber: boolean, setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>) => {
    if (grabber && dragging.current) {
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;

      last.current = { x: e.clientX, y: e.clientY };

      setCamera(c => ({
        ...c,
        x: c.x + dx,
        y: c.y + dy,
      }));

      setTextBoxes(boxes =>
        boxes.map(box => ({
          ...box,
          x: box.x + dx,
          y: box.y + dy
        }))
      );
    }
  };

  const handleCameraMouseUp = () => {
    dragging.current = false;
    setIsDragging(false);
  };

  const handleCameraWheel = (e: React.WheelEvent<HTMLCanvasElement>, grabber: boolean) => {
    if (grabber) {
      const zoomFactor = 1 - e.deltaY * 0.001;
      const newZoom = Math.max(0.1, Math.min(5, camera.zoom * zoomFactor));
      
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const worldX = (mouseX - camera.x) / camera.zoom;
      const worldY = (mouseY - camera.y) / camera.zoom;
      
      const newCameraX = mouseX - worldX * newZoom;
      const newCameraY = mouseY - worldY * newZoom;
      
      setCamera({
        x: newCameraX,
        y: newCameraY,
        zoom: newZoom,
      });
    }

    if (!grabber) {
      const dx = e.shiftKey ? e.deltaY : e.deltaX;
      const dy = e.shiftKey ? 0 : e.deltaY;

      setCamera(c => ({
        ...c,
        x: c.x - dx,
        y: c.y - dy,
      }));
    }
  };

  return {
    isDragging,
    setIsDragging,
    camera,
    setCamera,
    canvasRef,
    dragging,
    last,
    handleCameraMouseDown,
    handleCameraMouseMove,
    handleCameraMouseUp,
    handleCameraWheel
  };
}
