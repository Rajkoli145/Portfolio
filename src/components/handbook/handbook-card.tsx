import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { chapterHref, getChapters, handbooks } from "@/lib/handbooks";

type HandbookCardProps = {
  handbook: (typeof handbooks)[number];
};

export function HandbookCard({ handbook }: HandbookCardProps) {
  const chapters = getChapters(handbook.id);

  return (
    <section id={handbook.id} aria-labelledby={`${handbook.id}-title`} className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm scroll-mt-8">
      <div className="space-y-2 mb-6 pb-6 border-b">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-3" aria-hidden="true" />
            Available
          </span>
          <span className="text-xs text-muted-foreground">{chapters.length} Chapters</span>
        </div>
        <h2 id={`${handbook.id}-title`} className="text-2xl font-bold tracking-tight">{handbook.title}</h2>
        <p className="text-muted-foreground text-sm max-w-xl">{handbook.description}</p>
      </div>
      <nav aria-label={`${handbook.title} table of contents`}>
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">Table of Contents</h3>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chapters.map((chapter, index) => (
            <li key={chapter._meta.path}>
              <Link href={chapterHref(chapter)} className="flex h-full items-start gap-3 p-3.5 rounded-xl border bg-background hover:bg-muted/60 hover:border-primary/30 transition-colors group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
                <span className="flex items-center justify-center bg-muted text-foreground rounded-lg size-8 font-semibold text-xs shrink-0" aria-hidden="true">{String(index).padStart(2, "0")}</span>
                <span className="text-sm font-medium self-center">{chapter.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
