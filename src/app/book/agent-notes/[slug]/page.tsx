import { allAgentNotes } from "content-collections";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FlaskConical } from "lucide-react";
import { MDXContent } from "@content-collections/mdx/react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return allAgentNotes.map((note) => ({
    slug: note._meta.path.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const note = allAgentNotes.find((n) => n._meta.path.replace(/\.mdx$/, "") === slug);

  if (!note) return;

  return {
    title: `${note.title} | Research Lab Notes`,
    description: note.summary,
  };
}

export default async function AgentNotePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const currentIndex = allAgentNotes.findIndex(
    (n) => n._meta.path.replace(/\.mdx$/, "") === slug
  );

  const note = allAgentNotes[currentIndex];

  if (!note) {
    notFound();
  }

  const previousNote = currentIndex > 0 ? allAgentNotes[currentIndex - 1] : null;
  const nextNote = currentIndex < allAgentNotes.length - 1 ? allAgentNotes[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto py-12 pb-24 sm:py-24 px-6">
      <section id="research-note">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/book"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 inline-flex items-center gap-1 group bg-card"
            aria-label="Back to Books & Handbooks"
          >
            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Handbooks
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FlaskConical className="size-3.5" />
            <span>Research Lab Note</span>
          </div>
        </div>

        <h1 className="title font-bold text-3xl sm:text-4xl tracking-tighter mb-8">{note.title}</h1>

        <article className="prose prose-neutral dark:prose-invert max-w-none prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3">
          <MDXContent code={note.mdx} />
        </article>

        <div className="mt-20 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          {previousNote ? (
            <Link
              href={`/book/agent-notes/${previousNote._meta.path.replace(/\.mdx$/, "")}`}
              className="flex items-center gap-2 px-4 py-3 border rounded-xl hover:bg-muted transition-colors w-full sm:w-auto text-left group"
            >
              <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Previous Note</span>
                <span className="font-medium text-foreground line-clamp-1">{previousNote.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextNote ? (
            <Link
              href={`/book/agent-notes/${nextNote._meta.path.replace(/\.mdx$/, "")}`}
              className="flex items-center justify-end gap-2 px-4 py-3 border rounded-xl hover:bg-muted transition-colors w-full sm:w-auto text-right group"
            >
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Next Note</span>
                <span className="font-medium text-foreground line-clamp-1">{nextNote.title}</span>
              </div>
              <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform text-muted-foreground" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
