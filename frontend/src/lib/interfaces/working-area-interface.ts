export interface TextBox {
  id: number;
  text: string | null;
  x: number;
  y: number;
  color: string;
  fontSize: string;
  text_align: React.CSSProperties["textAlign"];
  opacity: number[];
  size: number;
}

export const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "12px",
  large: "16px",
  "x-large": "20px",
  "xx-large": "24px",
};

export type FontSize = (string)[number];