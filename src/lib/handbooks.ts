import { allChapters } from "content-collections";

export type HandbookId = "startup-research" | "software-engineering";
export type Chapter = (typeof allChapters)[number];

export const handbooks = [
  {
    id: "software-engineering",
    title: "Software Engineering & Product Development Handbook",
    description: "A practical guide to turning software ideas into real products, covering problem discovery, requirements, architecture, implementation, testing, and deployment.",
  },
  {
    id: "startup-research",
    title: "Startup Research Handbook",
    description: "A comprehensive system for finding, evaluating, and validating startup opportunities before spending months building.",
  },
] as const satisfies ReadonlyArray<{
  id: HandbookId;
  title: string;
  description: string;
}>;

const engineeringPrefix = "software-engineering/";

export function chapterSlug(chapter: Chapter): string {
  return chapter._meta.path.replace(/\.(md|mdx)$/, "");
}

export function chapterHref(chapter: Chapter): string {
  return `/book/${chapterSlug(chapter)}`;
}

export function getChapters(handbook: HandbookId): Chapter[] {
  return allChapters
    .filter((chapter) => handbook === "software-engineering"
      ? chapter._meta.path.startsWith(engineeringPrefix)
      : !chapter._meta.path.includes("/"))
    .sort((a, b) => {
      const number = (chapter: Chapter) =>
        Number.parseInt(chapterSlug(chapter).split("/").pop() ?? "", 10);
      return number(a) - number(b);
    });
}
