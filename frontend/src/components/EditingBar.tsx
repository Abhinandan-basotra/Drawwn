import { useState, type RefObject } from "react";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  PenLine,
  Type,
  Code2,
  Italic,
  Copy,
  Trash2,
  Link2,
} from "lucide-react";


interface StrokeColor {
  color: string;
  label: string;
}


const STROKE_COLORS: StrokeColor[] = [
  { color: "#111827", label: "Black" },
  { color: "#ef4444", label: "Red" },
  { color: "#22c55e", label: "Green" },
  { color: "#3b82f6", label: "Blue" },
  { color: "#f97316", label: "Orange" },
  { color: "#374151", label: "Dark Gray" },
];

const FONT_SIZES = [
  {
    size: "small",
    shortcut: "S"
  },
  {
    size: "large",
    shortcut: "M"
  },
  {
    size: "x-large",
    shortcut: "L"
  },
  {
    size: "xx-large",
    shortcut: "XL"
  }
] as const;
type FontSize = (typeof FONT_SIZES)[number];


function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
      {children}
    </p>
  );
}

function TipButton({
  label,
  onClick,
  children,
  className = "",
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 cursor-pointer ${className}`}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}


export function EditingBar({
  strokeColor,
  setStrokeColor,
  ref,
  setFontSize,
  fontSize,
}: {
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  ref: RefObject<HTMLElement | null>;
  setFontSize: (fontSize: string) => void;
  fontSize: string
}) {

  const [fontFamily, setFontFamily] = useState<number>(0);
  const [textAlign, setTextAlign] = useState<number>(0);
  const [opacity, setOpacity] = useState<number[]>([100]);

  const fontFamilyOptions = [
    { icon: <PenLine size={14} />, label: "Handwriting" },
    { icon: <Type size={14} />, label: "Serif" },
    { icon: <Code2 size={14} />, label: "Monospace" },
    { icon: <Italic size={14} />, label: "Italic" },
  ];

  const textAlignOptions = [
    { icon: <AlignLeft size={14} />, label: "Align left" },
    { icon: <AlignCenter size={14} />, label: "Align center" },
    { icon: <AlignRight size={14} />, label: "Align right" },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <aside ref={ref} className="absolute bottom-15 left-5 flex flex-col w-56 h-120 bg-white border-r border-border px-3 py-3 gap-3 overflow-y-auto shadow-sm select-none rounded-lg">
        <section>
          <SectionLabel>Stroke</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {STROKE_COLORS.map(({ color, label }) => (
              <Tooltip key={color}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setStrokeColor(color)}
                    aria-label={label}
                    className="cursor-pointer h-7 w-7 rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:scale-110"
                    style={{
                      backgroundColor: color,
                      boxShadow:
                        strokeColor === color
                          ? `0 0 0 2px white, 0 0 0 3.5px ${color}`
                          : "0 1px 3px rgba(0,0,0,0.2)",
                      transform: strokeColor === color ? "scale(1.1)" : undefined,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <SectionLabel>Font family</SectionLabel>
          <div className="flex gap-1">
            {fontFamilyOptions.map((opt, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Toggle
                    size="sm"
                    pressed={fontFamily === i}
                    onPressedChange={() => setFontFamily(i)}
                    aria-label={opt.label}
                    className="cursor-pointer h-7 w-7 p-0 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                  >
                    {opt.icon}
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {opt.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <SectionLabel>Font size</SectionLabel>
          <div className="flex gap-1">
            {FONT_SIZES.map((size) => (
              <Toggle
                key={size.size}
                size="sm"
                pressed={fontSize === size.size}
                onPressedChange={(pressed) =>{if(pressed) setFontSize(size.size)}}
                aria-label={`Font size ${size}`}
                className="cursor-pointer h-7 w-7 p-0 text-[11px] font-bold data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
              >
                {size.shortcut}
              </Toggle>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <SectionLabel>Text align</SectionLabel>
          <div className="flex gap-1">
            {textAlignOptions.map((opt, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Toggle
                    size="sm"
                    pressed={textAlign === i}
                    onPressedChange={() => setTextAlign(i)}
                    aria-label={opt.label}
                    className="cursor-pointer h-7 w-7 p-0 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                  >
                    {opt.icon}
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {opt.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center justify-between mb-2.5">
            <SectionLabel>Opacity</SectionLabel>
            <span className="text-xs font-semibold tabular-nums text-primary -mt-2.5">
              {opacity[0]}
            </span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={opacity}
            onValueChange={setOpacity}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground">0</span>
            <span className="text-[10px] text-muted-foreground">100</span>
          </div>
        </section>

        <Separator />

        <section>
          <SectionLabel>Actions</SectionLabel>
          <div className="flex gap-1">
            <TipButton label="Duplicate"><Copy size={14} /></TipButton>
            <TipButton
              label="Delete"
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 size={14} />
            </TipButton>
            <TipButton label="Copy link"><Link2 size={14} /></TipButton>
          </div>
        </section>

      </aside>
    </TooltipProvider>
  );
}