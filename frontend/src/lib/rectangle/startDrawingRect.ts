export const startDrawingRect = (
  x: number, 
  y: number, 
  setIsDrawingRect: (value: boolean) => void, 
  startPoint: React.MutableRefObject<{ x: number; y: number }>, 
  nextIdRef: React.MutableRefObject<number>, 
  setRectangles: (value: React.SetStateAction<{ id: number; x: number; y: number; width: number; height: number; stroke: string }[]>) => void
) => {
  setIsDrawingRect(true);
  startPoint.current = { x, y };

  const newId = nextIdRef.current++;

  setRectangles(prev => [
    ...prev,
    { id: newId, x, y, width: 0, height: 0, stroke: "#000000" }
  ]);
};