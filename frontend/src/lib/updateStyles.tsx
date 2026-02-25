import type { TextBox } from "@/pages/WorkingArea";

//get states
export const getActiveTextBoxColor = (textBoxes: TextBox[], activeState: number | null) => {
    const activeTextBox = textBoxes.find(tb => tb.id === activeState);
    return activeTextBox?.color || "#111827";
};

export const getActiveTextBoxSize = (textBoxes: TextBox[], activeState: number | null) => {
    const activeTextBox = textBoxes.find(tb => tb.id === activeState);
    return activeTextBox?.fontSize || "sm";
};

export const getActiveTextAlign = (textBoxes: TextBox[], activeState: number | null) => {
    const activeTextBox = textBoxes.find(tb => tb.id === activeState);
    return activeTextBox?.text_align || "start";
};

export const getActiveTextBoxOpacity = (textBoxes: TextBox[], activeState: number | null) => {
    const activeTextBox = textBoxes.find(tb => tb.id === activeState);
    return activeTextBox?.opacity || [100];
};

//update states
export const updateTextBoxPosition = (setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>, id: number, x: number, y: number) => {
    setTextBoxes(boxes =>
        boxes.map(box =>
            box.id === id ? { ...box, x, y } : box
        )
    );
};

export const updateTextBoxColor = (setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>, id: number, color: string) => {
    setTextBoxes(boxes =>
        boxes.map(box =>
            box.id === id ? { ...box, color } : box
        )
    );
};

export const updateTextSize = (setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>, id: number, fontSize: string) => {
    setTextBoxes(boxes =>
        boxes.map(box =>
            box.id === id ? { ...box, fontSize } : box
        )
    );
};

export const updateTextAlignment = (setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>, id: number, text_align: React.CSSProperties["textAlign"]) => {
    setTextBoxes(boxes =>
        boxes.map(box =>
            box.id === id ? { ...box, text_align } : box
        )
    )
};

export const updateTextOpacity = (setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>, id: number, opacity: number[]) => {
    setTextBoxes(boxes =>
        boxes.map(box =>
            box.id === id ? { ...box, opacity } : box
        )
    )
}

export const updateTextBoxText = (setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>, id: number, text: string) => {
    setTextBoxes(boxes =>
        boxes.map(box =>
            box.id === id ? { ...box, text } : box
        )
    )
}