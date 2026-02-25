import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps {
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

function Textarea({
  className,
  activeState,
  setActiveState,
  setTextBoxes,
  grabber,
  id,
  onRemove,
  onColorChange,
  position,
  onPositionChange,
  editingBarRef,
  setOpenEditingBar,
  style: parentStyle,
  value,
  onChange,
  ...props
}: TextareaProps) {
  const [clickCount, setClickCount] = React.useState(0);
  const dragTextBox = React.useRef(false);
  const dragResize = React.useRef(false);
  const [isHoveringCorner, setIsHoveringCorner] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const lastTextPos = React.useRef({ x: 0, y: 0 });
  const lastResizePos = React.useRef({ x: 0, y: 0 });
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const cornerSize = 10;

  const textBoxContent = value || '';

  React.useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [])

  const onTextMouseDown = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (textBoxContent.length === 0 || grabber) return;
    e.stopPropagation();
    setActiveState?.(id ?? null);
    const rect = e.currentTarget.getBoundingClientRect();

    const isBottomRightCorner = e.clientX >= rect.right - cornerSize &&
      e.clientX <= rect.right &&
      e.clientY >= rect.bottom - cornerSize &&
      e.clientY <= rect.bottom;

    if (isBottomRightCorner && clickCount >= 1) {
      dragResize.current = true;
      lastResizePos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
      return;
    }

    dragTextBox.current = true;

    setClickCount((prev) => {
      const next = prev + 1;
      if (grabber) return 0;
      if (next < 3) {
        e.preventDefault();
        inputRef?.current?.blur();
      }
      return next;
    });
    lastTextPos.current = { x: e.clientX, y: e.clientY };
  };

  const onTextMouseUp = () => {
    if (grabber) return;
    dragTextBox.current = false;
    dragResize.current = false;
  }

  const onTextMouseMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (clickCount >= 1 && !grabber && !dragTextBox.current && !dragResize.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isInBottomRightCorner =
        e.clientX >= rect.right - cornerSize &&
        e.clientX <= rect.right &&
        e.clientY >= rect.bottom - cornerSize &&
        e.clientY <= rect.bottom;

      setIsHoveringCorner(isInBottomRightCorner);
    } else {
      setIsHoveringCorner(false);
    }

    handleTextMove(e);
  };

  const onTextMouseLeave = () => {
    setIsHoveringCorner(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!inputRef?.current) return;
      if (!inputRef.current.contains(e.target as Node) && !editingBarRef?.current?.contains(e.target as Node)) {
        setClickCount(0);
        setActiveState?.(null);
        dragTextBox.current = false;
        dragResize.current = false;
        setIsHoveringCorner(false);
        setOpenEditingBar?.(false);

        if (textBoxContent.trim().length === 0) {
          onRemove?.();
        }
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragResize.current) {
        const dx = e.clientX - lastResizePos.current.x;
        const dy = e.clientY - lastResizePos.current.y;

        const delta = (dx + dy) * 0.005;

        setScale(prev => {
          const newScale = prev + delta;
          return Math.max(0.3, Math.min(5, newScale));
        });

        lastResizePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleGlobalMouseUp = () => {
      dragResize.current = false;
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && id === activeState) {
        e.preventDefault();
        onRemove?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [textBoxContent, onRemove]);

  const handleTextMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!dragTextBox.current || grabber || !clickCount || clickCount >= 3) return;
    const dx = e.clientX - lastTextPos.current.x;
    const dy = e.clientY - lastTextPos.current.y;

    lastTextPos.current = { x: e.clientX, y: e.clientY };

    if (!position) return;
    onPositionChange?.(position?.x + dx, position?.y + dy);
  }

  const handleBlur = () => {
    setClickCount(0);
  }

  const shouldApplyInteraction = id === activeState;

  const interactionClass = grabber
    ? "cursor-default border-none hover:border-transparent"
    : isHoveringCorner
      ? "cursor-nwse-resize border border-blue-400"
      : clickCount == 1 || clickCount == 2
        ? "border border-blue-400 hover:cursor-all-scroll"
        : clickCount >= 3
          ? "cursor-auto hover:border-transparent"
          : "";
  return (
    <textarea
      ref={inputRef}
      data-slot="textarea"
      readOnly={grabber}
      {...props}
      className={cn(
        "placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30 flex field-sizing-content bg-transparent transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-2 py-1 w-auto font-['Virgil'] resize-none [&::-webkit-resizer]:hidden rounded",
        shouldApplyInteraction ? interactionClass : "",
        className
      )}
      style={{
        ...parentStyle,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        transition: 'transform 0.1s ease-out',
      }}

      value={textBoxContent}
      onChange={(e) => onChange?.(e.target.value)}
      onMouseDown={onTextMouseDown}
      onMouseUp={onTextMouseUp}
      onMouseMove={onTextMouseMove}
      onMouseLeave={onTextMouseLeave}
      onBlur={handleBlur}
    />
  )
}

export { Textarea }