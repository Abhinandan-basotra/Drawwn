import { useEffect, useRef, useState } from "react";

export function WorkingArea() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const [camera, setCamera] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    zoom: 1,
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    draw(ctx);
  }, [camera]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.setTransform(camera.zoom, 0, 0, camera.zoom, camera.x, camera.y);
    ctx.clearRect(
      -camera.x / camera.zoom,
      -camera.y / camera.zoom,
      ctx.canvas.width / camera.zoom,
      ctx.canvas.height / camera.zoom
    );

    drawGrid(ctx);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const size = 40;
    ctx.strokeStyle = "#222";

    const range = 3000;
    for (let x = -range; x <= range; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, -range);
      ctx.lineTo(x, range);
      ctx.stroke();
    }

    for (let y = -range; y <= range; y += size) {
      ctx.beginPath();
      ctx.moveTo(-range, y);
      ctx.lineTo(range, y);
      ctx.stroke();
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    last.current = { x: e.clientX, y: e.clientY };

    setCamera(c => ({
      ...c,
      x: c.x + dx,
      y: c.y + dy,
    }));
  };

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = 1 - e.deltaY * 0.001;

    setCamera(c => ({
      ...c,
      zoom: Math.min(Math.max(c.zoom * zoomFactor, 0.2), 4),
    }));
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
      style={{
        cursor: dragging.current ? "grabbing" : "grab",
      }}
    />
  );
}
