"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { allChapters } from "content-collections";
import Link from "next/link";
import { BookOpen, CheckCircle2 } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export default function BookPage() {
  const sortedStartupChapters = [...allChapters].sort((a, b) => {
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
              Startup Research Handbook
            </h1>
            <p className="text-lg text-muted-foreground max-w-[620px]">
              A living handbook for finding real startup opportunities by researching real problems, customer pain points, and market gaps.
            </p>
          </div>
        </BlurFade>

        {/* Handbooks Container */}
        <div className="flex flex-col gap-12">
          <BlurFade delay={BLUR_FADE_DELAY * 1.5}>
            <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="size-3" />
                      Available
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {sortedStartupChapters.length} Chapters
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Startup Research Handbook
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-xl">
                    A comprehensive system for finding, evaluating, and validating startup opportunities before spending months building.
                  </p>
                </div>
              </div>

              {/* Table of Contents for Book */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                  Table of Contents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sortedStartupChapters.map((chapter, id) => (
                    <Link
                      key={chapter._meta.path}
                      href={`/book/${chapter._meta.path.replace(/\.(md|mdx)$/, "")}`}
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
        </div>
      </section>
    </div>
  );
}
