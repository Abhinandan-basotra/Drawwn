import {
  ArrowRight,
  Baseline,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image,
  Lock,
  LucideMousePointerClick,
  Menu,
  Minus,
  Pencil,
  RectangleHorizontal,
  ToolCase,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import type { Dispatch, SetStateAction } from "react";

const ToolButton = ({ children , handleClick}: { children: React.ReactNode; handleClick?: void}) => (
  <button
    className="
      p-2 rounded-md
      hover:bg-gray-100
      active:bg-gray-200
      transition cursor-pointer
    "
    
  >
    {children}
  </button>
);

export function Navbar(
  {
    setGrab
  } :
  {
    setGrab: Dispatch<SetStateAction<boolean>>
  }
) {
  return (
    <div
      className="
        absolute top-0 left-0 w-full
        h-14
        px-3
        flex items-center justify-between
        z-50
      "
    >
      <div className="flex items-center gap-2">
        <ToolButton>
          <Menu size={18} />
        </ToolButton>
      </div>

      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg shadow-lg mt-2">
        <ToolButton><Lock size={18} /></ToolButton>
        <Separator orientation="vertical" className="h-6 mx-1"/>

        <ToolButton><Hand size={18} /></ToolButton>
        <ToolButton><LucideMousePointerClick size={18} /></ToolButton>
        <ToolButton><RectangleHorizontal size={18} /></ToolButton>
        <ToolButton><Diamond size={18} /></ToolButton>
        <ToolButton><Circle size={18} /></ToolButton>
        <ToolButton><ArrowRight size={18} /></ToolButton>
        <ToolButton><Minus size={18} /></ToolButton>
        <ToolButton><Pencil size={18} /></ToolButton>
        <ToolButton><Baseline size={18} /></ToolButton>
        <ToolButton><Image size={18} /></ToolButton>
        <ToolButton><Eraser size={18} /></ToolButton>

        <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolButton><ToolCase size={18} /></ToolButton>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="bg-blue-300 hover:bg-blue-400 cursor-pointer">Share</Button>
      </div>
    </div>
  );
}
