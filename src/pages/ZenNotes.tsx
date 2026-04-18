import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RiFileTextLine, RiPriceTag3Line } from "@remixicon/react";

const STORAGE_KEY = "zen-notes";

type ZenNote = {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

export default function ZenNotes() {
  const [notes, setNotes] = useState<ZenNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fall through
    }
    return [];
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(true);

  const activeNote = notes.find((n) => n.id === activeId) || null;

  const createNote = useCallback(() => {
    const note: ZenNote = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
    setActiveId(note.id);
    setShowAll(false);
  }, []);

  const updateContent = useCallback((id: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content, updatedAt: Date.now() } : n))
    );
  }, []);

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setShowAll(true);
      }
    },
    [activeId]
  );

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // keyboard: ctrl+n new, ctrl+s save (auto), esc back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        createNote();
      }
      if (e.key === "Escape" && !showAll) {
        setShowAll(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [createNote, showAll]);

  const wordCount = activeNote?.content.trim()
    ? activeNote.content.trim().split(/\s+/).length
    : 0;

  return (
    <div className="zen-notes relative flex h-screen w-full overflow-hidden bg-neutral-950 text-neutral-200">
      {/* Floating tag cloud background */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute top-20 left-10 text-9xl">◯</div>
        <div className="absolute bottom-40 right-20 text-8xl">○</div>
        <div className="absolute top-1/2 left-1/4 text-7xl">●</div>
        <div className="absolute bottom-20 left-1/3 text-8xl">◉</div>
      </div>

      {/* Header */}
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-neutral-800/50 bg-neutral-900/30 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs">
            <RiPriceTag3Line className="h-3 w-3" />
            ZEN
          </Badge>
          <Separator orientation="vertical" className="h-4 bg-neutral-700/50" />
          <span className="text-xs text-neutral-500">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!showAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(true)}
              className="text-neutral-400 hover:text-neutral-200"
              type="button"
            >
              ← All Notes
            </Button>
          )}
          <Button onClick={createNote} size="sm" className="gap-1.5">
            <RiFileTextLine className="h-4 w-4" />
            New
          </Button>
        </div>
      </header>

      {showAll ? (
        <div className="flex h-full w-full items-center justify-center pt-16">
          {notes.length === 0 ? (
            <div className="text-center">
              <div className="mb-4 text-6xl opacity-20">◇</div>
              <h2 className="mb-2 text-xl font-light tracking-wide">No notes yet</h2>
              <p className="mb-6 text-sm text-neutral-500">
                Press <kbd className="rounded border border-neutral-700 px-1.5 py-0.5 text-xs">Ctrl+N</kbd> or click New
              </p>
              <Button onClick={createNote} variant="outline" className="gap-2">
                <RiFileTextLine className="h-4 w-4" />
                Create First Note
              </Button>
            </div>
          ) : (
            <div className="grid w-[800px] max-w-[90vw] grid-cols-1 gap-3">
              {notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    setActiveId(note.id);
                    setShowAll(false);
                  }}
                  className="group flex items-start gap-4 rounded-lg border border-neutral-800/50 bg-neutral-900/20 p-5 text-left backdrop-blur-sm transition-all hover:border-neutral-700/70 hover:bg-neutral-800/20 hover:shadow-lg hover:shadow-neutral-950/50"
                  type="button"
                >
                  <div className="flex-shrink-0">
                    <RiFileTextLine className="h-5 w-5 text-neutral-600 group-hover:text-neutral-400" />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="mb-1 text-sm font-medium text-neutral-200">
                      {note.content.split("\n")[0] || "Untitled"}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Delete note"
                    type="button"
                  >
                    ✕
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col pt-16">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-16 py-12">
              <Textarea
                value={activeNote?.content || ""}
                onChange={(e) => updateContent(activeId!, e.target.value)}
                placeholder="Begin writing... no distractions"
                className="h-[calc(100vh-200px)] resize-none border-0 bg-transparent p-0 text-lg leading-relaxed text-neutral-200 placeholder:text-neutral-800 focus-visible:ring-0"
                autoFocus
              />
            </div>
          </div>
          <div className="border-t border-neutral-800/50 bg-neutral-900/30 px-8 py-2 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>{wordCount} words</span>
              <span>{new Date(activeNote!.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
