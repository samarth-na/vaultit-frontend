import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  RiPaletteLine,
  RiAddLine,
  RiDeleteBinLine,
  RiPriceTag3Line,
  RiSearchLine,
} from "@remixicon/react";

const STORAGE_KEY = "carddeck-notes";

type ColorTag = "rose" | "amber" | "emerald" | "blue" | "violet" | "slate";

const COLOR_MAP: Record<ColorTag, { bg: string; text: string; border: string }> = {
  rose: { bg: "bg-rose-100 dark:bg-rose-950/30", text: "text-rose-700 dark:text-rose-300", border: "border-rose-300 dark:border-rose-700" },
  amber: { bg: "bg-amber-100 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-300 dark:border-amber-700" },
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-300 dark:border-emerald-700" },
  blue: { bg: "bg-blue-100 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-300 dark:border-blue-700" },
  violet: { bg: "bg-violet-100 dark:bg-violet-950/30", text: "text-violet-700 dark:text-violet-300", border: "border-violet-300 dark:border-violet-700" },
  slate: { bg: "bg-slate-100 dark:bg-slate-800/40", text: "text-slate-700 dark:text-slate-300", border: "border-slate-300 dark:border-slate-600" },
};

type CardDeckNote = {
  id: string;
  title: string;
  content: string;
  color: ColorTag;
  createdAt: number;
  updatedAt: number;
};

export default function CardDeck() {
  const [notes, setNotes] = useState<CardDeckNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fall through
    }
    return [];
  });
  const [filter, setFilter] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<ColorTag | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editColor, setEditColor] = useState<ColorTag>("slate");

  const filtered = notes.filter((n) => {
    const matchesText =
      n.title.toLowerCase().includes(filter.toLowerCase()) ||
      n.content.toLowerCase().includes(filter.toLowerCase());
    const matchesColor = selectedColor === "all" || n.color === selectedColor;
    return matchesText && matchesColor;
  });

  const createNote = useCallback(() => {
    const colors: ColorTag[] = ["rose", "amber", "emerald", "blue", "violet", "slate"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const note: CardDeckNote = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: "New Card",
      content: "",
      color: randomColor,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent("");
    setEditColor(randomColor);
  }, []);

  const updateNote = useCallback(() => {
    if (!editingId) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingId
          ? { ...n, title: editTitle || "Untitled", content: editContent, updatedAt: Date.now() }
          : n
      )
    );
    setEditingId(null);
  }, [editingId, editTitle, editContent]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingId === id) setEditingId(null);
  }, [editingId]);

  const startEdit = useCallback((note: CardDeckNote) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditColor(note.color);
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        createNote();
      }
      if (e.key === "Escape") {
        setEditingId(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [createNote]);

  return (
    <div className="card-deck relative min-h-screen bg-gradient-to-br from-neutral-50 to-slate-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Decorative floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20" />
        <div className="absolute bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-900/15" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-neutral-200/60 bg-white/70 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-900/70">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <RiPaletteLine className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  Card Deck
                </h1>
              </div>
              <Separator orientation="vertical" className="h-6 bg-neutral-300 dark:bg-neutral-700" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {notes.length} card{notes.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Color filter */}
              <div className="flex items-center gap-1.5">
                <Button
                  variant={selectedColor === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedColor("all")}
                  className="px-3"
                >
                  All
                </Button>
                {(Object.keys(COLOR_MAP) as ColorTag[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                      selectedColor === color ? "scale-110 ring-2 ring-offset-2" : "",
                      COLOR_MAP[color].border,
                      COLOR_MAP[color].bg
                    )}
                    aria-label={`Filter by ${color}`}
                    type="button"
                  />
                ))}
              </div>

              <Separator orientation="vertical" className="h-6 bg-neutral-300 dark:bg-neutral-700" />

              {/* Search */}
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="Search cards..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="h-9 w-48 pl-9"
                />
              </div>

              <Button onClick={createNote} className="gap-2">
                <RiAddLine className="h-4 w-4" />
                New Card
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700">
              <RiPaletteLine className="h-10 w-10 text-neutral-500 dark:text-neutral-400" />
            </div>
            <h2 className="mb-2 text-2xl font-light text-neutral-800 dark:text-neutral-200">
              Your deck is empty
            </h2>
            <p className="mb-6 max-w-md text-neutral-600 dark:text-neutral-400">
              Create colorful cards to organize your thoughts. Each card gets a random color.
            </p>
            <Button onClick={createNote} size="lg" className="gap-2">
              <RiAddLine className="h-5 w-5" />
              Create Your First Card
            </Button>
          </div>
        ) : editingId ? (
          <div className="mx-auto max-w-2xl">
            <Card className="border-2 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Card title"
                    className="h-8 text-lg font-semibold border-0 px-0 focus-visible:ring-0"
                  />
                  <div className="flex gap-1">
                    {(Object.keys(COLOR_MAP) as ColorTag[]).map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={cn(
                          "h-6 w-6 rounded-full border border-neutral-300 dark:border-neutral-600",
                          COLOR_MAP[color].bg,
                          editColor === color ? "ring-2 ring-offset-1 ring-neutral-400" : ""
                        )}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Write your note..."
                  className="min-h-[200px] w-full resize-none border-0 bg-transparent p-0 text-neutral-700 dark:text-neutral-300 focus:outline-none"
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-neutral-200/50 bg-neutral-50/50 px-6 py-3 dark:border-neutral-800/50 dark:bg-neutral-900/50">
                <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} type="button">
                  Cancel
                </Button>
                <Button onClick={updateNote} size="sm" type="button">
                  Save Card
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((note) => {
              const colorStyles = COLOR_MAP[note.color];
              return (
                <Card
                  key={note.id}
                  onClick={() => startEdit(note)}
                  className={cn(
                    "group cursor-pointer border-2 transition-all hover:scale-[1.02] hover:shadow-lg",
                    colorStyles.border,
                    colorStyles.bg
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-1 text-base">
                        {note.title}
                      </CardTitle>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Delete card"
                        type="button"
                      >
                        <RiDeleteBinLine className="h-4 w-4 text-neutral-500 hover:text-rose-600" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <RiPriceTag3Line className="h-3 w-3" />
                      <span className="capitalize">{note.color}</span>
                    </div>
                  </CardHeader>
                  <Separator className="bg-black/10 dark:bg-white/10" />
                  <CardContent className="pt-3">
                    <p className="line-clamp-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {note.content || "Empty card — click to edit"}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-black/5 bg-black/5 px-4 py-2 text-xs text-neutral-500 dark:border-white/10 dark:bg-white/5">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
