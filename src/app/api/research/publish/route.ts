import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { isEditorUnlocked, isSameOrigin } from "@/lib/editor-auth";
import { formatFrontmatter, parseFrontmatter, resolveEntryPath } from "@/lib/research-files";

const runFile = promisify(execFile);
const ENTRIES_DIR = path.join(process.cwd(), "research", "entries");
let publishing = false;

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development" || !isSameOrigin(request)) return NextResponse.json({ error: "Publishing is only available locally." }, { status: 403 });
  if (!await isEditorUnlocked()) return NextResponse.json({ error: "Editor is locked." }, { status: 401 });
  if (publishing) return NextResponse.json({ error: "Another entry is being published. Try again when it finishes." }, { status: 409 });
  let filePath: string;
  try {
    const { slug } = await request.json();
    if (typeof slug !== "string") throw new Error("Invalid slug");
    filePath = resolveEntryPath(ENTRIES_DIR, slug);
  } catch {
    return NextResponse.json({ error: "Invalid entry slug." }, { status: 400 });
  }
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Entry file not found" }, { status: 404 });
  publishing = true;
  try {
    const { metadata, body } = parseFrontmatter(fs.readFileSync(filePath, "utf8"));
    fs.writeFileSync(filePath, formatFrontmatter({ ...metadata, status: "published", updatedAt: new Date().toISOString() }) + body, "utf8");
    const relativePath = path.relative(process.cwd(), filePath);
    const git = (args: string[]) => runFile("git", args, { cwd: process.cwd(), timeout: 60_000 });
    // Commit only this entry, even when the user has staged unrelated files.
    await git(["add", "--", relativePath]);
    await git(["commit", "--only", "-m", `publish: ${metadata.title || path.basename(filePath)}`, "--", relativePath]);
    try {
      await git(["push"]);
    } catch {
      return NextResponse.json({ success: true, warning: "Entry committed locally, but push failed. Push manually.", slug: path.basename(filePath).replace(/\.mdx?$/, "") }, { status: 202 });
    }
    return NextResponse.json({ success: true, message: "Entry published and pushed. Vercel will redeploy automatically." });
  } catch {
    return NextResponse.json({ success: false, error: "Publishing failed before push. Review the entry and Git status locally before retrying." }, { status: 500 });
  } finally {
    publishing = false;
  }
}
