import { useState, useRef, useCallback } from "react";
import { Bold, Italic, Underline, Strikethrough, Highlighter, Image, List, ListOrdered, Heading1, Heading2, Quote, Code, AlignLeft, AlignCenter, Link as LinkIcon } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const ToolButton = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-lg transition-all ${active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCmd = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) execCmd("insertImage", url);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) execCmd("createLink", url);
  };

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-card/50">
        <ToolButton onClick={() => execCmd("bold")} title="Bold"><Bold className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("italic")} title="Italic"><Italic className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("underline")} title="Underline"><Underline className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("strikeThrough")} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("hiliteColor", "#fef3c7")} title="Highlight"><Highlighter className="w-4 h-4" /></ToolButton>
        <div className="w-px h-6 bg-border self-center mx-1" />
        <ToolButton onClick={() => execCmd("formatBlock", "h1")} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("formatBlock", "h2")} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("formatBlock", "blockquote")} title="Quote"><Quote className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("formatBlock", "pre")} title="Code"><Code className="w-4 h-4" /></ToolButton>
        <div className="w-px h-6 bg-border self-center mx-1" />
        <ToolButton onClick={() => execCmd("insertUnorderedList")} title="Bullet List"><List className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("insertOrderedList")} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("justifyLeft")} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={() => execCmd("justifyCenter")} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolButton>
        <div className="w-px h-6 bg-border self-center mx-1" />
        <ToolButton onClick={insertImage} title="Insert Image"><Image className="w-4 h-4" /></ToolButton>
        <ToolButton onClick={insertLink} title="Insert Link"><LinkIcon className="w-4 h-4" /></ToolButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[300px] p-4 font-body text-foreground outline-none prose prose-sm max-w-none [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:font-display [&_h2]:font-display [&_a]:text-primary [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={() => {
          if (editorRef.current) onChange(editorRef.current.innerHTML);
        }}
        data-placeholder={placeholder || "Start writing..."}
      />
    </div>
  );
};

export default RichTextEditor;
