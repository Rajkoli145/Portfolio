import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { isEditorUnlocked, isSameOrigin } from "@/lib/editor-auth";
import { formatFrontmatter, parseFrontmatter, resolveEntryPath } from "@/lib/research-files";

const ENTRIES_DIR = path.join(process.cwd(), "research", "entries");
const entrySchema = z.object({
  slug: z.string().optional(),
  title: z.string().trim().min(1),
  createdAt: z.string().optional(),
  project: z.string().default("failure-recovery-benchmark"),
  tags: z.array(z.string()).default(["research-notes"]),
  notes: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  summary: z.string().default(""),
  content: z.string().default(""),
});

async function accessError(request?: Request) {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "Local editor API is only available in development mode." }, { status: 403 });
  if (request && !isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!await isEditorUnlocked()) return NextResponse.json({ error: "Editor is locked." }, { status: 401 });
}

export async function GET() {
  const denied = await accessError();
  if (denied) return denied;
  try {
    fs.mkdirSync(ENTRIES_DIR, { recursive: true });
    const entries = fs.readdirSync(ENTRIES_DIR).filter(file => /\.mdx?$/.test(file)).map(filename => {
      const { metadata, body } = parseFrontmatter(fs.readFileSync(resolveEntryPath(ENTRIES_DIR, filename), "utf8"));
      const slug = filename.replace(/\.mdx?$/, "");
      return {
        slug, filename,
        title: metadata.title || slug.replace(/-/g, " "),
        createdAt: metadata.createdAt || metadata.publishedAt || new Date().toISOString(),
        updatedAt: metadata.updatedAt || metadata.createdAt || new Date().toISOString(),
        project: metadata.project || "failure-recovery-benchmark",
        tags: Array.isArray(metadata.tags) ? metadata.tags : ["research-notes"],
        notes: Array.isArray(metadata.notes) ? metadata.notes : [],
        status: metadata.status || "published",
        summary: metadata.summary || "",
        content: body,
      };
    });
    entries.sort((a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime());
    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json({ error: "Unable to read research entries." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await accessError(request);
  if (denied) return denied;
  try {
    const parsed = entrySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid entry fields." }, { status: 400 });
    const entry = parsed.data;
    let filePath: string;
    try {
      filePath = resolveEntryPath(ENTRIES_DIR, entry.slug || entry.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    } catch {
      return NextResponse.json({ error: "Invalid entry slug." }, { status: 400 });
    }
    fs.mkdirSync(ENTRIES_DIR, { recursive: true });
    const existing = fs.existsSync(filePath) ? parseFrontmatter(fs.readFileSync(filePath, "utf8")).metadata : {};
    const now = new Date().toISOString();
    const metadata = {
      ...existing,
      title: entry.title,
      createdAt: existing.createdAt || entry.createdAt || now,
      updatedAt: now,
      project: entry.project,
      tags: entry.tags,
      notes: entry.notes,
      status: entry.status,
      summary: entry.summary,
    };
    fs.writeFileSync(filePath, formatFrontmatter(metadata) + entry.content, "utf8");
    return NextResponse.json({ success: true, slug: path.basename(filePath).replace(/\.mdx?$/, "") });
  } catch {
    return NextResponse.json({ error: "Unable to save research entry." }, { status: 500 });
  }
}

export async function PUT(request: Request) { return POST(request); }

export async function DELETE(request: Request) {
  const denied = await accessError(request);
  if (denied) return denied;
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  let filePath: string;
  try { filePath = resolveEntryPath(ENTRIES_DIR, slug); }
  catch { return NextResponse.json({ error: "Invalid entry slug." }, { status: 400 }); }
  try {
    if (!fs.existsSync(filePath)) return NextResponse.json({ error: "File not found" }, { status: 404 });
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete research entry." }, { status: 500 });
  }
}
