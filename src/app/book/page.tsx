import BlurFade from "@/components/magicui/blur-fade";
import { allChapters } from "content-collections";
import Link from "next/link";
import type { Metadata } from "next";
import { Lock, BookOpen, CheckCircle2, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Books & Handbooks",
  description: "A collection of research handbooks, engineering guides, and ongoing monographs.",
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
    <div className="max-w-4xl mx-auto py-12 pb-24 sm:py-24 px-6">
      <section id="books">
        {/* Header */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex flex-col gap-3 mb-12 items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">
              <BookOpen className="size-3.5" />
              <span>Research Handbooks</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Books & Handbooks
            </h1>
            <p className="text-lg text-muted-foreground max-w-[620px]">
              A collection of living handbooks, research monographs, and practical guides on startup research and autonomous AI agent systems.
            </p>
          </div>
        </BlurFade>

        {/* Handbooks Container */}
        <div className="flex flex-col gap-12">
          
          {/* Book 1: Startup Research Handbook (Unlocked) */}
          <BlurFade delay={BLUR_FADE_DELAY * 1.5}>
            <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="size-3" />
                      Available
                    </span>
                    <span className="text-xs text-muted-foreground">13 Chapters</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Startup Research Handbook
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-xl">
                    A living handbook for finding real startup opportunities by researching real problems, customer pain points, and market gaps.
                  </p>
                </div>
              </div>

              {/* Table of Contents for Book 1 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                  Table of Contents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sortedChapters.map((chapter, id) => (
                    <Link
                      key={chapter._meta.path}
                      href={`/book/${chapter._meta.path.replace(/\.mdx$/, "")}`}
                      className="flex items-center gap-3 p-3.5 rounded-xl border bg-background hover:bg-muted/60 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center justify-center bg-primary/10 text-primary rounded-lg size-8 font-semibold text-xs shrink-0">
                        {id < 10 ? `0${id}` : id}
                      </div>
                      <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                        {chapter.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Book 2: Autonomous Organization Handbook (Locked) */}
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="rounded-2xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-80" />
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      <Lock className="size-3" />
                      Locked • Writing in Progress
                    </span>
                    <span className="text-xs text-muted-foreground">50 Chapters Planned</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <span>The Autonomous Organization Handbook</span>
                    <Lock className="size-5 text-amber-500 shrink-0" />
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-xl">
                    A personal digital research lab and multi-year handbook investigating the principles, dynamics, and architecture of organizations composed of autonomous, adaptive AI agents and human-machine collectives.
                  </p>
                </div>
              </div>

              {/* Locked Notice & Details */}
              <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-6 flex flex-col items-center text-center gap-3">
                <div className="size-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  <Lock className="size-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-foreground">
                    Handbook Currently Locked
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                    This handbook is actively being researched and written. Access to the 50 chapters is currently restricted while initial drafts, benchmarks, and agent simulations are finalized.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium pt-1">
                  <Sparkles className="size-3.5" />
                  <span>Early chapters releasing soon</span>
                </div>
              </div>
            </div>
          </BlurFade>

        </div>
      </section>
    </div>
  );
}
