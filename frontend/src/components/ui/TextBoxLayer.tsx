import { Textarea } from "@/components/ui/textarea";
import { FONT_SIZE_MAP, type TextBox } from "@/lib/interfaces/working-area-interface";
import type { RefObject } from "react";

interface TextBoxLayerProps {
  textBox: TextBox;
  activeState: number | null;
  setActiveState: (id: number | null) => void;
  setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>;
  grabber: boolean;
  setOpenEditingBar: (open: boolean) => void;
  editingBarRef: RefObject<HTMLElement | null>;
  handleTextChange: (id: number, text: string, setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>) => void;
  updateTextBoxPosition: (setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>, id: number, x: number, y: number) => void;
  removeTextBox: (id: number) => void;
  updateTextBoxColor: (setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>, id: number, color: string) => void;
}

export function TextBoxLayer({
  textBox,
  activeState,
  setActiveState,
  setTextBoxes,
  grabber,
  setOpenEditingBar,
  editingBarRef,
  handleTextChange,
  updateTextBoxPosition,
  removeTextBox,
  updateTextBoxColor,
}: TextBoxLayerProps) {
  return (
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
  );
}
