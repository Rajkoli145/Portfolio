"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NotebookPen } from "lucide-react";

export function NotesSection({ notes }: { notes: string[] }) {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="not-prose mb-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <NotebookPen className="size-3.5" />
          <span>Notes</span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </span>
      </div>

      <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-5 sm:p-6 space-y-4">
        {notes.map((note, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-background p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/60">
              <span className="text-[10px] font-mono font-bold text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2 prose-h1:text-base prose-h2:text-sm prose-h3:text-sm prose-strong:text-foreground prose-code:text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 mb-2 border-t border-border" />
    </div>
  );
}
