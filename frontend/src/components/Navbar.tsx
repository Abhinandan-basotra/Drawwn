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
  { id: "pan", icon: Hand },
  { id: "select", icon: LucideMousePointerClick },
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
    setGrab,
    setCircle,
    setRectangle,
    setLine,
  }:
    {
      setGrab: Dispatch<SetStateAction<boolean>>
      setCircle: Dispatch<SetStateAction<boolean>>
      setRectangle: Dispatch<SetStateAction<boolean>>
      setLine: Dispatch<SetStateAction<boolean>>
    }
) {
  const [activeTool, setActiveTool] = useState<Tool>("select");

  const handleToolClick = (tool: Tool) => {
    setGrab(false);
    setCircle(false);
    setRectangle(false);
    setLine(false);
    setActiveTool(tool);
    switch (tool) {
      case "pan":
        setGrab(true);
        break;
      case "circle":
        setCircle(true);
        break;
      case "rect":
        setRectangle(true);
        break;
      case "line":
        setLine(true);
        break;
      default:
        break;
    }
  };

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
        {tools.map(({ id, icon: Icon }) => (
          <ToolButton
            key={id}
            active={activeTool === id}
            handleClick={() => handleToolClick(id)}
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
