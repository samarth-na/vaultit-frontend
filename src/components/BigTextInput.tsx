import { useState } from "react";
import { Clipboard, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ClipboardNotesPage() {
  const [content, setContent] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent((prev) => (prev ? prev + "\n" + text : text));
    } catch (err) {
      console.error("Failed to read clipboard");
    }
  };

  const handleClear = () => {
    setContent("");
  };

  return (
    <main className=" bg-background p-4 md:p-8 border text-slate-900 w-fit rounded-2xl">
      <div className="mx-auto w-fit">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Clipboard Notes
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePaste}
              className="gap-2 bg-transparent"
            >
              <Clipboard className="h-4 w-4" />
              Paste from Clipboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="gap-2 text-destructive hover:text-destructive bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your clipboard history, notes, or any text here..."
            className="h-[calc(100vh-12rem)] w-[80ch] resize-none rounded-lg border border-input bg-card p-4 font-mono text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            spellCheck={false}
          />
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
            {content.length.toLocaleString()} characters
          </div>
        </div>
      </div>
    </main>
  );
}
