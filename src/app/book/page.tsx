import BlurFade from "@/components/magicui/blur-fade";
import { allChapters } from "content-collections";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Research Bible",
  description: "A living handbook for finding real startup opportunities by researching real problems.",
};

const BLUR_FADE_DELAY = 0.04;

export default function BookPage() {
  const sortedChapters = [...allChapters].sort((a, b) => {
    // Sort by file name which starts with numbers (00, 01, 02)
    const getNum = (path: string) => {
        const match = path.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 999;
    };
    return getNum(a._meta.path) - getNum(b._meta.path);
  });

  return (
    <div className="max-w-3xl mx-auto py-12 pb-24 sm:py-24 px-6">
      <section id="book">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex flex-col gap-4 mb-10 items-center text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">Startup Research Bible</h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              A living handbook for finding real startup opportunities by researching real problems.
            </p>
          </div>
        </BlurFade>

        <div className="flex flex-col gap-3">
          <BlurFade delay={BLUR_FADE_DELAY * 1.5}>
            <h3 className="font-semibold text-lg border-b pb-2 mb-2">Table of Contents</h3>
          </BlurFade>
          {sortedChapters.map((chapter, id) => (
            <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.03} key={chapter._meta.path}>
              <Link
                href={`/book/${chapter._meta.path.replace(/\.mdx$/, "")}`}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-center bg-primary/10 text-primary rounded-lg w-10 h-10 font-bold shrink-0">
                  {id}
                </div>
                <h2 className="text-lg font-medium group-hover:text-primary transition-colors">{chapter.title}</h2>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  );
}
