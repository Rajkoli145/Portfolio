import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HandbookReader } from "@/components/handbook/handbook-reader";
import { chapterSlug, getChapters } from "@/lib/handbooks";

const handbook = "startup-research";
const chapters = getChapters(handbook);
type ChapterPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapterSlug(chapter).split("/").pop()! }));
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = chapters.find((chapter) => chapterSlug(chapter).split("/").pop() === slug);
  if (!chapter) notFound();
  return { title: chapter.title, description: chapter.summary };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  if (!chapters.some((chapter) => chapterSlug(chapter).split("/").pop() === slug)) notFound();
  return <HandbookReader handbook={handbook} chapters={chapters} slug={slug} />;
}
