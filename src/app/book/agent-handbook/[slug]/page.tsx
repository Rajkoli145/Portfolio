import { allAgentChapters } from "content-collections";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MDXContent } from "@content-collections/mdx/react";
import { isHandbookUnlocked } from "@/lib/handbook-auth";
import { HandbookLockScreen } from "@/components/handbook-lock-screen";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return allAgentChapters.map((chapter) => ({
    slug: chapter._meta.path.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const chapter = allAgentChapters.find((c) => c._meta.path.replace(/\.mdx$/, "") === slug);

  if (!chapter) return;

  return {
    title: `${chapter.title} | The Autonomous Organization Handbook`,
    description: chapter.summary,
  };
}

export default async function AgentChapterPage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ secret?: string }>;
}) {
  const { slug } = await props.params;
  const resolvedSearchParams = props.searchParams ? await props.searchParams : undefined;
  
  const { unlocked } = await isHandbookUnlocked(resolvedSearchParams?.secret);

  const sortedChapters = [...allAgentChapters].sort((a, b) => {
    const getNum = (path: string) => {
      const match = path.match(/^(\d+)/);
      return match ? parseInt(match[1]) : 999;
    };
    return getNum(a._meta.path) - getNum(b._meta.path);
  });

  const currentIndex = sortedChapters.findIndex(
    (c) => c._meta.path.replace(/\.mdx$/, "") === slug
  );
  
  const chapter = sortedChapters[currentIndex];

  if (!chapter) {
    notFound();
  }

  if (!unlocked) {
    return <HandbookLockScreen title={chapter.title} />;
  }

  const previousChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto py-12 pb-24 sm:py-24 px-6">
      <section id="chapter">
        <div className="flex justify-start items-center mb-8">
          <Link href="/book" className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 inline-flex items-center gap-1 group bg-card" aria-label="Back to Table of Contents">
            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Table of Contents
          </Link>
        </div>

        <h1 className="title font-bold text-4xl tracking-tighter mb-10">{chapter.title}</h1>
        
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3">
          <MDXContent code={chapter.mdx} />
        </article>
        
        <div className="mt-20 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          {previousChapter ? (
            <Link href={`/book/agent-handbook/${previousChapter._meta.path.replace(/\.mdx$/, "")}`} className="flex items-center gap-2 px-4 py-3 border rounded-xl hover:bg-muted transition-colors w-full sm:w-auto text-left group">
                <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform text-muted-foreground" />
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Previous</span>
                    <span className="font-medium text-foreground line-clamp-1">{previousChapter.title}</span>
                </div>
            </Link>
          ) : <div></div>}
          
          {nextChapter ? (
            <Link href={`/book/agent-handbook/${nextChapter._meta.path.replace(/\.mdx$/, "")}`} className="flex items-center justify-end gap-2 px-4 py-3 border rounded-xl hover:bg-muted transition-colors w-full sm:w-auto text-right group">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Next</span>
                    <span className="font-medium text-foreground line-clamp-1">{nextChapter.title}</span>
                </div>
                <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform text-muted-foreground" />
            </Link>
          ) : <div></div>}
        </div>
      </section>
    </div>
  );
}
