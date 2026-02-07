import { Navbar } from "@/components/Navbar";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";

export function WorkingArea() {
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [grabber, setGrabber] = useState(false);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [textBox, setTextBox] = useState({ x: 0, y: 0, visible: false});
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [camera, setCamera] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    zoom: 1,
  });

  useEffect(() => {
    if (textBox.visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [textBox.visible])

  useEffect(() => {
    const canvas = canvasRef.current!; //! means i know this is not null
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);


  //temporary
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

  //temporary
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const size = 40;
    ctx.strokeStyle = "#f5f5f5";
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
    if (!grabber) return;
    dragging.current = true;
    setIsDragging(true);
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    dragging.current = false;
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!grabber) return;
    if (!dragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    last.current = { x: e.clientX, y: e.clientY };

    setCamera(c => ({
      ...c,
      x: c.x + dx,
      y: c.y + dy,
    }));

    setTextBox(c => ({
      ...c,
      x: c.x + dx,
      y: c.y + dy
    }))
  };

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (grabber) {
      const zoomFactor = 1 - e.deltaY * 0.001;
      setCamera(c => ({
        ...c,
        zoom: Math.min(Math.max(c.zoom * zoomFactor, 0.2), 4),
      }));
      return;
    }

    if (!grabber) {

      const dx = e.shiftKey ? e.deltaY : e.deltaX;
      const dy = e.shiftKey ? 0 : e.deltaY;

      setCamera((c) => ({
        ...c,
        x: c.x - dx,
        y: c.y - dy,
      }));

      setTextBox((c) => ({
        visible: c.visible,
        x: c.x - dx,
        y: c.y - dy,
      }))
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if(grabber) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTextBox({
      visible: true,
      x,
      y,
    })
  }

  return (
    <div>
      <Navbar setGrab={setGrabber} />
      <div>
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
          onWheel={onWheel}
          onDoubleClick={handleDoubleClick}
          className={`${grabber ? `${isDragging ? "cursor-grabbing" : "cursor-grab"}` : ""}`}
        />
      </div>
      {
        textBox.visible && (
          <Textarea
            ref={inputRef}
            inputRef={inputRef}
            setTextBox={setTextBox}
            textBox={textBox}
            grabber={grabber}
            style={{
              position: "absolute",
              left: textBox.x,
              top: textBox.y,
            }}
            className={`px-2 py-1 text-sm 
                      border border-transparent ${grabber ? "cursor-default"  : "hover:border-blue-400 hover:cursor-all-scroll"} 
                      w-auto
                      font-['Virgil'] resize-none
                      [&::-webkit-resizer]:hidden
                      rounded
                    `}
          />
        )
      }
    </div>
  );
}
