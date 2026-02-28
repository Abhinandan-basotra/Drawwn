import { EditingBar } from "@/components/EditingBar";
import { Textarea } from "@/components/ui/textarea";
import { FONT_SIZE_MAP, type TextBox } from "@/lib/interfaces/working-area-interface";
import { 
  getActiveTextAlign, 
  getActiveTextBoxColor, 
  getActiveTextBoxOpacity, 
  getActiveTextBoxSize, 
  handleColorChange, 
  handleDeleteTextBox, 
  handleDuplicateTextBox, 
  handleOpacityChange, 
  handleSizeChange, 
  handleTextAlign, 
  handleTextChange, 
  updateTextBoxColor, 
  updateTextBoxPosition 
} from "@/lib/updateStyles";
import { useEffect, useRef, useState } from "react";

export function WorkingArea({ grabber }: { grabber: boolean }) {
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const nextIdRef = useRef(0);
  const [activeState, setActiveState] = useState<number | null>(null);
  const [openEditingBar, setOpenEditingBar] = useState(false);
  const editingBarRef = useRef<HTMLElement>(null);

  const [camera, setCamera] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    zoom: 1,
  });

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

    setTextBoxes(boxes =>
      boxes.map(box => ({
        ...box,
        x: box.x + dx,
        y: box.y + dy
      }))
    )
  };

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
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

      setTextBoxes((boxes) =>
        boxes.map(box => ({
          ...box,
          x: box.x - dx,
          y: box.y - dy
        }))
      )
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (grabber) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newId = nextIdRef.current++;
    setTextBoxes(boxes => [...boxes, { id: newId, x, y, color: "#000000", fontSize: "lg", text_align: "start", opacity: [100], text: "", size: 1 }]);
  }

  const removeTextBox = (id: number) => {
    setTextBoxes(boxes => boxes.filter(box => box.id != id))
  }

  return (
    <div>
      {
        openEditingBar &&
        <EditingBar
          strokeColor={getActiveTextBoxColor(textBoxes, activeState)}
          setStrokeColor={(color) => handleColorChange(color, setTextBoxes, activeState)}
          ref={editingBarRef}
          fontSize={getActiveTextBoxSize(textBoxes, activeState)}
          setFontSize={(fontSize) => handleSizeChange(fontSize, setTextBoxes, activeState)}
          textAlignment={getActiveTextAlign(textBoxes, activeState)}
          setTextAlignment={(textAlignment) => handleTextAlign(textAlignment, setTextBoxes, activeState)}
          opacity={getActiveTextBoxOpacity(textBoxes, activeState)}
          setOpacity={(opacity) => handleOpacityChange(opacity, setTextBoxes, activeState)}
          handleDelete={() => handleDeleteTextBox(setTextBoxes, activeState)}
          handleDuplicate={() => handleDuplicateTextBox(setTextBoxes, activeState, nextIdRef)}
        />
      }
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
      {textBoxes.map((textBox) => (
        <Textarea
          key={textBox.id}
          id={textBox.id}
          activeState={activeState}
          setActiveState={setActiveState}
          setTextBoxes={setTextBoxes}
          grabber={grabber}
          onClick={() => setOpenEditingBar(true)}
          onFocus={() => setOpenEditingBar(true)}
          onChange={(text: string) => handleTextChange(textBox.id, text, setTextBoxes)}
          value={textBox.text || ""}
          position={{ x: textBox.x, y: textBox.y }}
          onPositionChange={(x: number, y: number) => updateTextBoxPosition(setTextBoxes, textBox.id, x, y)}
          onRemove={() => removeTextBox(textBox.id)}
          onColorChange={(color: string) => updateTextBoxColor(setTextBoxes, textBox.id, color)}
          setOpenEditingBar={setOpenEditingBar}
          editingBarRef={editingBarRef}
          style={{
            position: "absolute",
            left: textBox.x,
            transform: `scale(${textBox.size})`,
            color: `${textBox.color || "black"}${Math.round((textBox.opacity[0] / 100) * 255).toString(16).padStart(2, '0')}`,
            fontSize: FONT_SIZE_MAP[textBox.fontSize],
            top: textBox.y,
            textAlign: textBox.text_align || "start"
          }}
        />
      ))}
    </div>
  );
}
