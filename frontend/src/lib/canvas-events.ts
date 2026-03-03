import React from "react";

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export const getCanvasCoords = (
  e: React.MouseEvent<HTMLCanvasElement>, 
  canvasRef: React.RefObject<HTMLCanvasElement | null>, 
  camera: Camera
): { x: number; y: number } | null => {
  const rect = canvasRef.current?.getBoundingClientRect();
  if (!rect) return null;
  return {
    x: (e.clientX - rect.left - camera.x) / camera.zoom,
    y: (e.clientY - rect.top - camera.y) / camera.zoom,
  };
};