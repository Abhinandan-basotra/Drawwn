import { useRef, useState } from "react";
import type { TextBox } from "@/lib/interfaces/working-area-interface";


export function useTextBoxHandlers() {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [activeState, setActiveState] = useState<number | null>(null);
  const [openEditingBar, setOpenEditingBar] = useState(false);
  
  const nextIdRef = useRef(0);
  const editingBarRef = useRef<HTMLElement>(null);

  const handleTextBoxDoubleClick = (
    e: React.MouseEvent<HTMLCanvasElement>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    grabber: boolean
  ) => {
    if (grabber) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const newId = nextIdRef.current++;
    setTextBoxes(boxes => [...boxes, { 
      id: newId, 
      x: screenX, 
      y: screenY, 
      color: "#000000", 
      fontSize: "lg", 
      text_align: "start", 
      opacity: [100], 
      text: "", 
      size: 1 
    }]);
  };

  const removeTextBox = (id: number) => {
    setTextBoxes(boxes => boxes.filter(box => box.id != id))
  };

  return {
    textBoxes,
    setTextBoxes,
    activeState,
    setActiveState,
    openEditingBar,
    setOpenEditingBar,
    nextIdRef,
    editingBarRef,
    handleTextBoxDoubleClick,
    removeTextBox
  };
}
