import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialNote = {
  title: "",
  content: "",
};
export default function ClipboardNotesPage() {
  const [content, setContent] = useState("");
  const [note, setNote] = useState(initialNote);

  const handleClear = () => {
    setContent("");
  };
  useEffect(() => {
    console.log(note);
  }, [note]);

  function handleSave() {
    setNote({ ...note, content: content });
  }
  return (
    <main className=" bg-background p-4 md:p-8 border  w-fit rounded-2xl">
      <div className="mx-auto w-fit">
        <div className="mb-4 flex items-center justify-between">
          <input
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            placeholder="title.."
            className=" h-[1ch] p-4 w-[20ch] resize-none rounded-md border border-input  font-mono text-sm  placeholder:text-muted-foreground "
            spellCheck={false}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="gap-2 text-destructive hover:text-destructive bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <Button
              className="gap-2  hover:text-cyan-600 text-cyan-600 bg-transparent"
              variant="outline"
              size="sm"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              Save{" "}
            </Button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your clipboard history, notes, or any text here..."
            className="h-[calc(100vh-12rem)] w-[80ch] resize-none rounded-lg border border-input bg-card p-4 font-mono text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring focus:ring-ring focus:ring-offset-background"
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
