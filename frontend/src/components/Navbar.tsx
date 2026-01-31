import {
  ArrowRight,
  Baseline,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image,
  LucideMousePointerClick,
  Menu,
  Minus,
  Pencil,
  RectangleHorizontal,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, type Dispatch, type SetStateAction } from "react";

type ToolConfig = {
  id: string;
  icon: React.ComponentType<{ size?: number }>;
  grab?: boolean;
};



const tools: ToolConfig[] = [
  { id: "pan", icon: Hand, grab: true },
  { id: "select", icon: LucideMousePointerClick, grab: false },
  { id: "rect", icon: RectangleHorizontal },
  { id: "diamond", icon: Diamond },
  { id: "circle", icon: Circle },
  { id: "arrow", icon: ArrowRight },
  { id: "line", icon: Minus },
  { id: "pencil", icon: Pencil },
  { id: "text", icon: Baseline },
  { id: "image", icon: Image },
  { id: "eraser", icon: Eraser },
] as const;

type Tool = typeof tools[number]["id"];


const ToolButton = ({ children, handleClick, active }: { children: React.ReactNode; handleClick?: () => void; active?: boolean }) => (
  <button
    className={`
      p-2 rounded-md
      transition cursor-pointer
      ${active ? "bg-gray-200" : "hover:bg-gray-100"}
    `}
    onClick={handleClick}
  >
    {children}
  </button>
);

export function Navbar(
  {
    setGrab
  }:
    {
      setGrab: Dispatch<SetStateAction<boolean>>
    }
) {
  const [activeTool, setActiveTool] = useState<Tool>("select");

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
        {tools.map(({ id, icon: Icon, grab }) => (
          <ToolButton
            key={id}
            active={activeTool === id}
            handleClick={() => {
              setActiveTool(id)
              setGrab(grab ?? false)
            }}
          >
            <Icon size={18} />
          </ToolButton>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="bg-blue-300 hover:bg-blue-400 cursor-pointer">Share</Button>
      </div>
    </div>
  );
}
