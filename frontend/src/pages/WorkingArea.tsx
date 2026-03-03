import { EditingBar } from "@/components/EditingBar";
import { TextBoxLayer } from "@/components/ui/TextBoxLayer";
import { getCanvasCoords } from "@/lib/canvas-events";
import { drawCanvas, setupCanvas } from "@/utils/canvasDrawing";
import { useRectangleHandlers } from "@/hooks/useRectangleHandlers";
import { useTextBoxHandlers } from "@/hooks/useTextBoxHandlers";
import { useCameraHandlers } from "@/hooks/useCameraHandlers";
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
import { useEffect } from "react";

export function WorkingArea({
  grabber,
  rectangle,
  line,
  circle
}: {
  grabber: boolean;
  rectangle: boolean;
  line: boolean;
  circle: boolean;
}) {
  const rectangleHandlers = useRectangleHandlers();
  const textBoxHandlers = useTextBoxHandlers();
  const cameraHandlers = useCameraHandlers();

  const {
    rectangles,
    isDrawingRect,
    setIsDrawingRect,
    selectedRectId,
    currentCursor,
    handleRectangleMouseDown,
    handleRectangleMouseMove,
    handleRectangleMouseUp,
    startDrawingRect: startRectDrawing
  } = rectangleHandlers;

  const {
    textBoxes,
    setTextBoxes,
    activeState,
    setActiveState,
    openEditingBar,
    setOpenEditingBar,
    editingBarRef,
    handleTextBoxDoubleClick,
    removeTextBox
  } = textBoxHandlers;

  const {
    isDragging,
    camera,
    canvasRef,
    handleCameraMouseDown,
    handleCameraMouseMove,
    handleCameraMouseUp,
    handleCameraWheel
  } = cameraHandlers;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const cleanup = setupCanvas(canvas);
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      drawCanvas(ctx, camera, rectangles, selectedRectId);
    }

    return cleanup;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      drawCanvas(ctx, camera, rectangles, selectedRectId);
    }
  }, [camera, rectangles, selectedRectId]);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleRectangleMouseDown(e, canvasRef, camera, rectangle, grabber);
    handleCameraMouseDown(e, grabber);

    if (rectangle) {
      const coords = getCanvasCoords(e, canvasRef, camera);
      if (coords) {
        startRectDrawing(coords.x, coords.y, setIsDrawingRect);
      }
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleRectangleMouseMove(e, canvasRef, camera, isDragging, isDrawingRect, textBoxes);
    handleCameraMouseMove(e, grabber, setTextBoxes);
  };

  const onMouseUp = () => {
    handleRectangleMouseUp();
    handleCameraMouseUp();
  };

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    handleCameraWheel(e, grabber);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleTextBoxDoubleClick(e, canvasRef, grabber);
  };

  return (
    <div>
      {openEditingBar && activeState && (
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
          handleDuplicate={() => handleDuplicateTextBox(setTextBoxes, activeState, { current: textBoxes.length })}
        />
      )}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
          onWheel={onWheel}
          onDoubleClick={handleDoubleClick}
          className={`${grabber ? `${isDragging ? "cursor-grabbing" : "cursor-grab"}` : circle || rectangle || line ? "cursor-crosshair" : ""} ${currentCursor !== 'default' ? currentCursor : ''}`}
        />
        {textBoxes.map((textBox) => (
          <TextBoxLayer
            key={textBox.id}
            textBox={textBox}
            activeState={activeState}
            setActiveState={setActiveState}
            setTextBoxes={setTextBoxes}
            grabber={grabber}
            setOpenEditingBar={setOpenEditingBar}
            editingBarRef={editingBarRef}
            handleTextChange={handleTextChange}
            updateTextBoxPosition={updateTextBoxPosition}
            removeTextBox={removeTextBox}
            updateTextBoxColor={updateTextBoxColor}
          />
        ))}
      </div>
    </div>
  );
}
