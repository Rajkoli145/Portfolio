// Uses isolated temporary files and a fake Git executor: never commits or pushes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync as read, rmSync, existsSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import vm from "node:vm";
import { createHmac } from "node:crypto";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, overrides = {}, environment = {}) {
  const output = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports, Buffer, URL, Date, Request,
    process: { env: { NODE_ENV: "development", EDITOR_PASSWORD: "test-only-password", ...environment.env }, cwd: environment.cwd ?? process.cwd },
    require: name => name in overrides ? overrides[name] : require(name),
  }, { filename: file });
  return exports;
}
const files = load("src/lib/research-files.ts");
const json = value => JSON.parse(JSON.stringify(value));
const next = { NextResponse: { json: (body, options = {}) => Response.json(body, options) } };
const request = (body, method = "POST", origin) => new Request("http://localhost/api/research/entries", {
  method, headers: { "Content-Type": "application/json", ...(origin ? { origin } : {}) },
  ...(method !== "DELETE" ? { body: JSON.stringify(body) } : {}),
});

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), "portfolio-editor-test-"));
  const directory = path.join(root, "research", "entries");
  mkdirSync(directory, { recursive: true });
  return { root, directory, cwd: () => root, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

test("frontmatter round-trips quotes, backslashes, multiline markdown notes and arrays", () => {
  const metadata = {
    title: 'A "quoted" title $(command)',
    tags: [], notes: ['Markdown\n- a bullet\n\npath: C:\\files\n"quotes"', 'single "quote"'],
    summary: "Line one\nLine two", status: "draft",
  };
  const body = "## Example\n\nBody\n---\nMore body\n";
  const parsed = files.parseFrontmatter(files.formatFrontmatter(metadata) + body);
  assert.deepEqual(json(parsed.metadata), metadata);
  assert.equal(parsed.body, body);
  const block = files.parseFrontmatter('---\ntitle: "Example"\nnotes:\n  - |-\n    Markdown\n    - bullet\n    key: value\nstatus: "draft"\n---\nBody');
  assert.deepEqual(json(block.metadata.notes), ["Markdown\n- bullet\nkey: value"]);
  assert.equal(block.metadata.status, "draft");
});

test("entry paths reject traversal and symlinks, and preserve MDX extensions", () => {
  const f = fixture();
  try {
    for (const slug of ["../escape", "/tmp/file", "x/../../file", "$(command)", "--flag", ""]) {
      assert.throws(() => files.resolveEntryPath(f.directory, slug));
    }
    writeFileSync(path.join(f.directory, "example.mdx"), "example");
    assert.equal(files.resolveEntryPath(f.directory, "example"), path.join(f.directory, "example.mdx"));
    symlinkSync(path.join(f.directory, "example.mdx"), path.join(f.directory, "linked.md"));
    assert.throws(() => files.resolveEntryPath(f.directory, "linked"));
  } finally { f.cleanup(); }
});

test("editor sessions reject forged, modified and expired cookies", async () => {
  let cookie;
  const auth = load("src/lib/editor-auth.ts", { "next/headers": { cookies: async () => ({ get: () => cookie ? { value: cookie } : undefined }) } });
  assert.equal(auth.matchesEditorPassword("wrong"), false);
  assert.equal(auth.matchesEditorPassword("test-only-password"), true);
  cookie = "true";
  assert.equal(await auth.isEditorUnlocked(), false);
  cookie = auth.createEditorSession();
  assert.equal(await auth.isEditorUnlocked(), true);
  cookie += ".extra";
  assert.equal(await auth.isEditorUnlocked(), false);
  cookie = auth.createEditorSession().replace(/^\d+/, "99999999999999");
  assert.equal(await auth.isEditorUnlocked(), false);
  const payload = `1.${"a".repeat(32)}`;
  cookie = `${payload}.${createHmac("sha256", "test-only-password").update(payload).digest("hex")}`;
  assert.equal(await auth.isEditorUnlocked(), false);
  assert.equal(auth.isSameOrigin(request({}, "POST", "https://other.example")), false);
});

test("auth requires a configured password and sets an HTTP-only session cookie", async () => {
  let setCookie;
  const headers = { cookies: async () => ({ set: (...args) => { setCookie = args; }, delete: () => {} }) };
  const auth = load("src/lib/editor-auth.ts", { "next/headers": headers });
  const route = load("src/app/api/editor-auth/route.ts", { "next/server": next, "next/headers": headers, "@/lib/editor-auth": auth });
  assert.equal((await route.POST(request({ password: "wrong" }))).status, 401);
  assert.equal((await route.POST(request({ password: "test-only-password" }))).status, 200);
  assert.equal(setCookie[2].httpOnly, true);
  assert.equal(setCookie[2].sameSite, "strict");
  const unavailable = load("src/app/api/editor-auth/route.ts", { "next/server": next, "next/headers": headers, "@/lib/editor-auth": { ...auth, getExpectedEditorPassword: () => undefined } });
  assert.equal((await unavailable.POST(request({ password: "anything" }))).status, 503);
});

test("entry APIs require authentication, reject invalid paths, and preserve notes and creation dates", async () => {
  const f = fixture();
  let unlocked = false;
  const auth = { isEditorUnlocked: async () => unlocked, isSameOrigin: () => true };
  const route = load("src/app/api/research/entries/route.ts", { "next/server": next, "@/lib/editor-auth": auth, "@/lib/research-files": files }, f);
  try {
    assert.equal((await route.GET()).status, 401);
    assert.equal((await route.POST(request({ title: "Example" }))).status, 401);
    assert.equal((await route.DELETE(request({}, "DELETE"))).status, 401);
    unlocked = true;
    const payload = { slug: "example", title: "Example", content: "Body", notes: ["Keep this\n- bullet"], status: "draft" };
    assert.equal((await route.POST(request({ ...payload, slug: "../escape" }))).status, 400);
    assert.equal((await route.POST(request(payload))).status, 200);
    const first = files.parseFrontmatter(read(path.join(f.directory, "example.md"), "utf8"));
    assert.equal((await route.POST(request({ ...payload, title: "Updated", createdAt: "2099-01-01" }))).status, 200);
    const saved = files.parseFrontmatter(read(path.join(f.directory, "example.md"), "utf8"));
    assert.equal(saved.metadata.createdAt, first.metadata.createdAt);
    assert.deepEqual(json(saved.metadata.notes), payload.notes);
    assert.equal((await route.GET()).status, 200);
    const production = load("src/app/api/research/entries/route.ts", { "next/server": next, "@/lib/editor-auth": auth, "@/lib/research-files": files }, { ...f, env: { NODE_ENV: "production" } });
    assert.equal((await production.POST(request(payload))).status, 403);
  } finally { f.cleanup(); }
});

test("publishing preserves notes, passes entry titles as Git arguments and commits only its file", async () => {
  const f = fixture();
  const calls = [];
  let failure;
  const child = { execFile: (binary, args, options, done) => {
    calls.push({ binary, args, options });
    done(args[0] === failure ? new Error("Simulated Git failure") : null, "", "");
  } };
  const auth = { isEditorUnlocked: async () => true, isSameOrigin: () => true };
  const route = load("src/app/api/research/publish/route.ts", { "next/server": next, "node:child_process": child, "@/lib/editor-auth": auth, "@/lib/research-files": files }, f);
  const title = 'Literal $(touch /tmp/never-run) `command` "title"';
  const entry = path.join(f.directory, "example.md");
  try {
    writeFileSync(entry, files.formatFrontmatter({ title, status: "draft", notes: ["A note\n- bullet"], custom: "retain me" }) + "Body");
    assert.equal((await route.POST(request({ slug: "../escape" }))).status, 400);
    assert.equal(calls.length, 0);
    assert.equal((await route.POST(request({ slug: "example" }))).status, 200);
    const saved = files.parseFrontmatter(read(entry, "utf8"));
    assert.equal(saved.metadata.status, "published");
    assert.deepEqual(json(saved.metadata.notes), ["A note\n- bullet"]);
    assert.equal(saved.metadata.custom, "retain me");
    assert.deepEqual(json(calls[1].args), ["commit", "--only", "-m", `publish: ${title}`, "--", "research/entries/example.md"]);
    failure = "commit";
    calls.length = 0;
    assert.equal((await route.POST(request({ slug: "example" }))).status, 500);
    assert.equal(calls.some(call => call.args[0] === "push"), false);
    failure = "push";
    assert.equal((await route.POST(request({ slug: "example" }))).status, 202);
    assert.equal(existsSync(entry), true);
  } finally { f.cleanup(); }
});
