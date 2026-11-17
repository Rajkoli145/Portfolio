import type { Metadata } from "next";
import BlurFade from "@/components/magicui/blur-fade";
import { HandbookCard } from "@/components/handbook/handbook-card";
import { handbooks } from "@/lib/handbooks";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Handbooks",
  description: "Practical handbooks for startup research, software engineering, and product development.",
};

export default function BookPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 pb-24 sm:py-24 px-6">
      <section id="books">
        <BlurFade delay={0.04}>
          <div className="flex flex-col gap-3 mb-12 items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted text-muted-foreground text-xs font-medium">
              <BookOpen className="size-3.5" aria-hidden="true" />
              <span>Research & Engineering</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Handbooks</h1>
            <p className="text-lg text-muted-foreground max-w-[620px]">Practical guides to finding real problems and turning software ideas into useful products.</p>
          </div>
        </BlurFade>
        <div className="flex flex-col gap-12">
          {handbooks.map((handbook) => <HandbookCard key={handbook.id} handbook={handbook} />)}
        </div>
      </section>
    </div>
  );
}
