import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/mdx-components";
import { chapterHref, chapterSlug, handbooks, type Chapter, type HandbookId } from "@/lib/handbooks";

type HandbookReaderProps = {
  handbook: HandbookId;
  chapters: Chapter[];
  slug: string;
};

export function HandbookReader({ handbook, chapters, slug }: HandbookReaderProps) {
  const currentIndex = chapters.findIndex((chapter) => chapterSlug(chapter).split("/").pop() === slug);
  const chapter = chapters[currentIndex];
  const book = handbooks.find((book) => book.id === handbook)!;
  const previousChapter = chapters[currentIndex - 1];
  const nextChapter = chapters[currentIndex + 1];

  return (
    <div className="max-w-3xl mx-auto py-12 pb-24 sm:py-24 px-6">
      <section id="chapter">
        <div className="flex justify-start items-center mb-8">
          <Link
            href={`/book#${handbook}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 inline-flex items-center gap-1 group bg-card"
            aria-label={`Back to ${book.title} table of contents`}
          >
            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Table of Contents
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{book.title} · Chapter {String(currentIndex).padStart(2, "0")} of {chapters.length}</p>
        <h1 className="title font-bold text-3xl sm:text-4xl tracking-tight mb-10 break-words">{chapter.title}</h1>

        <article className="prose prose-neutral dark:prose-invert min-w-0 break-words max-w-none prose-pre:overflow-x-auto prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3">
          <MDXContent code={chapter.mdx} components={mdxComponents} />
        </article>

        <nav aria-label={`${book.title} chapter navigation`} className="mt-20 pt-8 border-t flex flex-col sm:flex-row justify-between items-stretch gap-4">
          {previousChapter ? (
            <Link
              href={chapterHref(previousChapter)} rel="prev"
              className="flex items-center gap-2 px-4 py-3 border rounded-xl hover:bg-muted transition-colors w-full sm:w-1/2 min-w-0 text-left group"
            >
              <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform text-muted-foreground" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Previous Chapter
                </span>
                <span className="font-medium text-foreground break-words">
                  {previousChapter.title}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <Link
              href={chapterHref(nextChapter)} rel="next"
              className="flex items-center justify-end gap-2 px-4 py-3 border rounded-xl hover:bg-muted transition-colors w-full sm:w-1/2 min-w-0 text-right group"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Next Chapter
                </span>
                <span className="font-medium text-foreground break-words">
                  {nextChapter.title}
                </span>
              </div>
              <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform text-muted-foreground" />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </section>
    </div>
  );
}
