export interface TextareaProps {
  className?: string;
  activeState?: number | null;
  setActiveState?: (id: number | null) => void;
  setTextBoxes?: React.Dispatch<React.SetStateAction<any[]>>;
  grabber?: boolean;
  id?: number;
  onRemove?: () => void;
  onColorChange?: (color: string) => void;
  position?: { x: number; y: number };
  strokeColor?: string;
  onPositionChange?: (x: number, y: number) => void;
  editingBarRef?: React.RefObject<HTMLElement | null>;
  setOpenEditingBar?: (open: boolean) => void;
  style?: React.CSSProperties;
  [key: string]: any;
}