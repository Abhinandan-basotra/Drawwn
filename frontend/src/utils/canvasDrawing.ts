import type { Rectangle } from "@/lib/interfaces/working-area-interface";
import type { Camera } from "@/lib/canvas-events";

export function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  
  const gridSize = 20;
  const offsetX = -ctx.canvas.width / 2;
  const offsetY = -ctx.canvas.height / 2;
  
  for (let x = offsetX; x < offsetX + ctx.canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, offsetY);
    ctx.lineTo(x, offsetY + ctx.canvas.height);
    ctx.stroke();
  }
  
  for (let y = offsetY; y < offsetY + ctx.canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(offsetX, y);
    ctx.lineTo(offsetX + ctx.canvas.width, y);
    ctx.stroke();
  }
}

export function drawCanvas(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  rectangles: Rectangle[],
  selectedRectId: number | null
) {
  ctx.setTransform(camera.zoom, 0, 0, camera.zoom, camera.x, camera.y);
  ctx.clearRect(
    -camera.x / camera.zoom,
    -camera.y / camera.zoom,
    ctx.canvas.width / camera.zoom,
    ctx.canvas.height / camera.zoom
  );

  drawGrid(ctx);
  
  rectangles.forEach(rect => {
    ctx.strokeStyle = rect.stroke;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    if (rect.id === selectedRectId) {
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = "#3b82f6";
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      ctx.restore();
    }
  });
}

export function setupCanvas(canvas: HTMLCanvasElement) {
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);
  return () => window.removeEventListener("resize", resize);
}
