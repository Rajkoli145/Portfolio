import BlurFade from "@/components/magicui/blur-fade";
import { allChapters, allAgentChapters } from "content-collections";
import Link from "next/link";
import type { Metadata } from "next";
import { Lock, BookOpen, CheckCircle2, Sparkles, KeyRound } from "lucide-react";
import { isHandbookUnlocked } from "@/lib/handbook-auth";

export const metadata: Metadata = {
  title: "Books & Handbooks",
  description: "A collection of research handbooks, engineering guides, and ongoing monographs.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BookPage(props: {
  searchParams?: Promise<{ secret?: string }>;
}) {
  const resolvedSearchParams = props.searchParams ? await props.searchParams : undefined;
  const { unlocked, reason } = await isHandbookUnlocked(resolvedSearchParams?.secret);

  const sortedStartupChapters = [...allChapters].sort((a, b) => {
    const getNum = (path: string) => {
      const match = path.match(/^(\d+)/);
      return match ? parseInt(match[1]) : 999;
    };
    return getNum(a._meta.path) - getNum(b._meta.path);
  });

  const sortedAgentChapters = [...allAgentChapters].sort((a, b) => {
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

            {unlocked && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                <CheckCircle2 className="size-3.5" />
                <span>Unlocked Access ({reason === "localhost" ? "Localhost" : reason === "ip" ? "Whitelisted IP" : "Passcode Verified"})</span>
              </div>
            )}
          </div>
        </BlurFade>

        {/* Handbooks Container */}
        <div className="flex flex-col gap-12">
          
          {/* Book 1: Startup Research Handbook */}
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
                  {sortedStartupChapters.map((chapter, id) => (
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

          {/* Book 2: Autonomous Organization Handbook */}
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="rounded-2xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-80" />
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      <Sparkles className="size-3" />
                      Active Research ({sortedAgentChapters.length} Released)
                    </span>
                    {!unlocked && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                        <Lock className="size-3" />
                        Restricted Access
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    The Autonomous Organization Handbook
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-xl">
                    A personal digital research lab and multi-year handbook investigating the principles, dynamics, and architecture of organizations composed of autonomous, adaptive AI agents and human-machine collectives.
                  </p>
                </div>
              </div>

              {/* Published Chapters for Book 2 */}
              {sortedAgentChapters.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Published Chapters</span>
                    {!unlocked && <span className="text-xs text-amber-500 font-normal">Requires Passcode or Author IP</span>}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sortedAgentChapters.map((chapter, id) => (
                      <Link
                        key={chapter._meta.path}
                        href={`/book/agent-handbook/${chapter._meta.path.replace(/\.mdx$/, "")}`}
                        className="flex items-center gap-3 p-3.5 rounded-xl border bg-background hover:bg-muted/60 hover:border-amber-500/30 transition-all group"
                      >
                        <div className="flex items-center justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg size-8 font-semibold text-xs shrink-0 border border-amber-500/20">
                          {id < 10 ? `0${id}` : id}
                        </div>
                        <h4 className="text-sm font-medium group-hover:text-amber-500 transition-colors line-clamp-1 flex-1">
                          {chapter.title}
                        </h4>
                        {!unlocked && <Lock className="size-3.5 text-muted-foreground shrink-0" />}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress / Lock Notice */}
              <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-6 flex flex-col items-center text-center gap-3">
                <div className="size-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  {unlocked ? <Sparkles className="size-6" /> : <Lock className="size-6" />}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-foreground">
                    {unlocked ? "Organic Monograph Progress" : "Restricted Monograph"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                    {unlocked
                      ? "This handbook is actively being written across 50 conceptual chapters. Released chapters are accessible above."
                      : "Full access to chapter text is restricted to authorized IP addresses or lead researchers holding the secret passcode."}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium pt-1">
                  <KeyRound className="size-3.5" />
                  <span>Passcode / IP Whitelist Protection Enabled</span>
                </div>
              </div>
            </div>
          </BlurFade>

        </div>
      </section>
    </div>
  );
}
