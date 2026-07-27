import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { ChevronLeft, Download, Mail, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Raj Koli",
  description: "Curriculum Vitae and background of Raj Koli.",
};

const BLUR_FADE_DELAY = 0.04;

export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 pb-24 sm:py-20 px-6">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex flex-col gap-6 mb-8">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 inline-flex items-center gap-1 group bg-card"
            >
              <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <FileText className="size-3.5" />
              <span>Curriculum Vitae</span>
            </div>
          </div>

          {/* Header & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Raj Koli — Resume</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Software Engineer focused on backend systems, AI agent infrastructure, and developer tooling.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="/Rajkoli_CV.pdf"
                download="Rajkoli_CV.pdf"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Download className="size-4" />
                <span>Download PDF</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
              >
                <Mail className="size-4" />
                <span>Contact Me</span>
              </Link>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Embedded PDF Viewer */}
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="w-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden p-2 sm:p-4">
          <iframe
            src="/Rajkoli_CV.pdf#toolbar=0"
            className="w-full h-[75vh] min-h-[600px] rounded-xl border-none"
            title="Raj Koli Resume PDF"
          />
        </div>
      </BlurFade>
    </div>
  );
}
