import fs from "node:fs";
import path from "node:path";

export type ResearchMetadata = Record<string, string | string[]>;

// Reads the flat metadata and indented string lists used by research entries.
// Writes JSON-escaped scalars, which are also valid YAML scalars.
export function parseFrontmatter(raw: string): { metadata: ResearchMetadata; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { metadata: {}, body: raw };
  const lines = match[1].split(/\r?\n/);
  const metadata: ResearchMetadata = {};
  const scalar = (value: string): string => {
    if (value.startsWith('"') && value.endsWith('"')) {
      try { return JSON.parse(value); } catch { return value.slice(1, -1); }
    }
    if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
    return value;
  };
  let key = "";
  for (let i = 0; i < lines.length; i++) {
    const field = lines[i].match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (field) {
      key = field[1];
      const value = field[2].trim();
      if (!value) metadata[key] = [];
      else if (value.startsWith("[")) {
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed) || !parsed.every(item => typeof item === "string")) throw new Error("Invalid metadata list");
        metadata[key] = parsed;
      } else metadata[key] = scalar(value);
      continue;
    }
    const item = lines[i].match(/^  -\s?(.*)$/);
    const items = metadata[key];
    if (item && key && Array.isArray(items)) {
      const value = item[1].trim();
      if (value === "|" || value === "|-") {
        const block: string[] = [];
        while (i + 1 < lines.length && (lines[i + 1].startsWith("    ") || !lines[i + 1].trim())) {
          block.push(lines[++i].slice(4));
        }
        items.push(block.join("\n").replace(/\n+$/, "") + (value === "|" ? "\n" : ""));
      } else items.push(scalar(value));
    }
  }
  return { metadata, body: raw.slice(match[0].length).replace(/^\r?\n/, "") };
}

export function formatFrontmatter(metadata: ResearchMetadata): string {
  return `---\n${Object.entries(metadata).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n")}\n---\n\n`;
}

export function resolveEntryPath(directory: string, slug: string): string {
  if (!/^[a-z0-9][a-z0-9_-]*(?:\.mdx?)?$/.test(slug)) throw new Error("Invalid entry slug");
  const filename = /\.mdx?$/.test(slug) ? slug : `${slug}.md`;
  let filePath = path.join(directory, filename);
  if (!/\.mdx?$/.test(slug) && !fs.existsSync(filePath) && fs.existsSync(`${filePath}x`)) filePath += "x";
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isSymbolicLink()) throw new Error("Entry symlinks are not supported");
  return filePath;
}
