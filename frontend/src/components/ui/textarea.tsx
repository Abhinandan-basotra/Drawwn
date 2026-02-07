import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, setTextBox,inputRef, textBox, grabber, ...props }: React.ComponentProps<"textarea">) {
  const [textBoxContent, setTextBoxContent] = React.useState('');
  const [clickCount, setClickCount] = React.useState(0);
  const dragTextBox = React.useRef(false);
  const lastTextPos = React.useRef({ x: 0, y: 0 });



  const onTextMouseDown = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if(textBoxContent.length === 0 || grabber) return;   
    e.stopPropagation();
    dragTextBox.current = true;
    
    setClickCount((prev) => {
      const next = prev + 1;
      if (next < 3) {
        e.preventDefault();
        inputRef?.current?.blur();
      }
      return next;
    });
    lastTextPos.current = { x: e.clientX, y: e.clientY };
  };


  const onTextMouseUp = () => {
    if(grabber) return;
    dragTextBox.current = false;
  }

  const handleTextMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!dragTextBox.current || grabber) return;
    const dx = e.clientX - lastTextPos.current.x;
    const dy = e.clientY - lastTextPos.current.y;

    lastTextPos.current = { x: e.clientX, y: e.clientY };

    if (!setTextBox) return;
    setTextBox(c => ({
      ...c,
      x: c.x + dx,
      y: c.y + dy
    }))
  }

  const handleBlur = () => {
    setClickCount(0);
  }
  
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30 flex field-sizing-content w-full rounded-md bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      value={textBoxContent}
      onChange={(e) => setTextBoxContent(e.target.value)}
      onMouseDown={onTextMouseDown}
      onMouseUp={onTextMouseUp}
      onMouseMove={handleTextMove}
      onBlur={handleBlur}
      {...props}
    />
  )
}

export { Textarea }
