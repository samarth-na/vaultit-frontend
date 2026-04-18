import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  RiTimeLine,
  RiCalendarLine,
  RiAddLine,
  RiDeleteBinLine,
  RiArrowUpLine,
  RiArrowDownLine,
} from "@remixicon/react";

const STORAGE_KEY = "timeline-notes";

type TimelineNote = {
  id: string;
  content: string;
  mood: "great" | "good" | "neutral" | "low" | null;
  createdAt: number;
};

const MOODS = [
  { value: "great", label: "Great", emoji: "✨", color: "text-amber-500" },
  { value: "good", label: "Good", emoji: "🙂", color: "text-emerald-500" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "text-blue-500" },
  { value: "low", label: "Low", emoji: "🌧️", color: "text-slate-500" },
] as const;

function groupByDate(notes: TimelineNote[]): Map<string, TimelineNote[]> {
  const map = new Map<string, TimelineNote[]>();
  const sorted = [...notes].sort((a, b) => b.createdAt - a.createdAt);
  for (const note of sorted) {
    const dateKey = new Date(note.createdAt).toISOString().split("T")[0];
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(note);
  }
  return map;
}

export default function TimelineNotes() {
  const getInitialExpanded = useCallback((): string => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: TimelineNote[] = JSON.parse(stored);
        const g = groupByDate(parsed);
        return g.keys().next().value || "";
      }
    } catch {
      void 0;
    }
    return "";
  }, []);

  const [notes, setNotes] = useState<TimelineNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      void 0;
    }
    return [];
  });
   const [expandedDate, setExpandedDate] = useState<string>(getInitialExpanded);
   const [isComposing, setIsComposing] = useState(true);
   const [newNoteContent, setNewNoteContent] = useState("");
   const [newNoteMood, setNewNoteMood] = useState<TimelineNote["mood"]>(null);

   const grouped = useMemo(() => groupByDate(notes), [notes]);

  const createNote = useCallback(() => {
    if (!newNoteContent.trim()) return;
    const note: TimelineNote = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      content: newNoteContent.trim(),
      mood: newNoteMood,
      createdAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
    setNewNoteContent("");
    setNewNoteMood(null);
    setIsComposing(false);
    // Expand today's date group
    const todayKey = new Date().toISOString().split("T")[0];
    setExpandedDate(todayKey);
  }, [newNoteContent, newNoteMood]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // keyboard: ctrl+enter submit
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && isComposing) {
        e.preventDefault();
        createNote();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [createNote, isComposing]);

  return (
    <div className="timeline-notes relative min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      {/* Timeline line SVG decoration */}
      <div className="absolute left-8 top-0 z-0 hidden h-full w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-neutral-700 to-transparent md:block" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-slate-50/80 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/80">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RiTimeLine className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Timeline
              </h1>
              <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                {notes.length} entr{notes.length === 1 ? "y" : "ies"}
              </Badge>
            </div>
            <Button
              onClick={() => setIsComposing(true)}
              size="sm"
              className="gap-2"
            >
              <RiAddLine className="h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Composition area */}
        {isComposing ? (
          <Card className="mb-8 border-2 border-dashed shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <RiCalendarLine className="h-5 w-5 text-slate-500" />
                <span>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="What's on your mind today?"
                className="min-h-[120px] resize-none"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Mood:</span>
                  <div className="flex gap-1">
                    {MOODS.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setNewNoteMood(mood.value)}
                        className={cn(
                          "rounded-full p-1.5 text-lg transition-all",
                          newNoteMood === mood.value
                            ? "bg-slate-200 dark:bg-neutral-800 scale-110"
                            : "hover:bg-slate-100 dark:hover:bg-neutral-900"
                        )}
                        type="button"
                        title={mood.label}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsComposing(false);
                      setNewNoteContent("");
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createNote}
                    disabled={!newNoteContent.trim()}
                    size="sm"
                    type="button"
                  >
                    Save Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setIsComposing(true)}
            variant="outline"
            className="mb-8 w-full gap-2 border-dashed py-6"
          >
            <RiAddLine className="h-5 w-5" />
            Add new timeline entry
          </Button>
        )}

        {/* Timeline entries grouped by date */}
        {Array.from(grouped.entries()).map(([dateKey, dateNotes]) => (
          <div key={dateKey} className="relative mb-8 pl-16">
            {/* Timeline dot */}
            <div className="absolute left-6 top-6 z-10 hidden h-3 w-3 rounded-full border-2 border-slate-400 bg-slate-200 shadow-md md:block" />

            {/* Date header */}
            <button
              onClick={() => setExpandedDate(expandedDate === dateKey ? "" : dateKey)}
              className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              type="button"
            >
              <RiCalendarLine className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(dateKey).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </div>
                <div className="text-xs text-slate-500">
                  {dateNotes.length} entr{dateNotes.length === 1 ? "y" : "ies"}
                </div>
              </div>
              <div className="text-slate-400 transition-transform group-hover:text-slate-600 dark:hover:text-slate-300">
                {expandedDate === dateKey ? (
                  <RiArrowUpLine className="h-5 w-5" />
                ) : (
                  <RiArrowDownLine className="h-5 w-5" />
                )}
              </div>
            </button>

            {/* Entries for this date */}
            {expandedDate === dateKey && (
              <div className="mt-3 space-y-3 border-l-2 border-slate-200 pl-6 dark:border-neutral-800">
                {dateNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-neutral-800"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {note.mood && (
                            <span
                              className="text-xl"
                              role="img"
                              aria-label={`Mood: ${note.mood}`}
                            >
                              {MOODS.find((m) => m.value === note.mood)?.emoji}
                            </span>
                          )}
                          <CardTitle className="line-clamp-1 text-base">
                            {note.content.split("\n")[0] || "Untitled"}
                          </CardTitle>
                        </div>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Delete entry"
                          type="button"
                        >
                          <RiDeleteBinLine className="h-4 w-4 text-slate-400 hover:text-rose-600" />
                        </button>
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(note.createdAt).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {note.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
