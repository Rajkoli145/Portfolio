// Run after starting the app: node --test tests/handbooks.test.mjs
// Override HANDBOOK_BASE_URL to check a production preview instead of localhost.
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const base = process.env.HANDBOOK_BASE_URL ?? "http://127.0.0.1:3000";
const books = [
  { directory: "content/book", route: "/book", anchor: "startup-research", count: 13 },
  { directory: "content/book/software-engineering", route: "/book/software-engineering", anchor: "software-engineering", count: 15 },
];

async function page(path) {
  const response = await fetch(new URL(path, base));
  return { status: response.status, html: await response.text() };
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#x27;");
}

function linkedChapter(html, relation) {
  const tag = [...html.matchAll(/<a\b[^>]*>/g)].find(([tag]) => tag.includes(`rel="${relation}"`))?.[0];
  return tag?.match(/href="([^"]+)"/)?.[1];
}

test("both handbook tables of contents link every chapter in order", async () => {
  const library = await page("/book");
  assert.equal(library.status, 200);
  for (const book of books) {
    const files = (await readdir(book.directory)).filter((file) => file.endsWith(".mdx")).sort();
    assert.equal(files.length, book.count);
    const contents = library.html.match(new RegExp(`<section id="${book.anchor}"[\\s\\S]*?</section>`))?.[0];
    assert.ok(contents, `${book.anchor} has its own section`);
    const links = [...contents.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(links, files.map((file) => `${book.route}/${file.replace(/\.mdx$/, "")}`));
  }
});

for (const book of books) {
  test(`${book.anchor}: direct URLs, content, metadata, and independent navigation`, async (t) => {
    const files = (await readdir(book.directory)).filter((file) => file.endsWith(".mdx")).sort();
    for (const [index, file] of files.entries()) {
      await t.test(file, async () => {
        const source = await readFile(`${book.directory}/${file}`, "utf8");
        const title = source.match(/^title: "(.+)"$/m)?.[1];
        assert.ok(title);
        const path = `${book.route}/${file.replace(/\.mdx$/, "")}`;
        const { status, html } = await page(path);
        assert.equal(status, 200, path);
        assert.ok(html.includes(`<h1`) && html.includes(`${escapeHtml(title)}</h1>`), "expected chapter heading");
        assert.ok(html.includes(`<title>${escapeHtml(title)}`), "chapter metadata");
        assert.ok(html.includes(`href="/book#${book.anchor}"`), "book-specific table of contents link");
        assert.equal(linkedChapter(html, "prev"), index > 0 ? `${book.route}/${files[index - 1].replace(/\.mdx$/, "")}` : undefined);
        assert.equal(linkedChapter(html, "next"), index < files.length - 1 ? `${book.route}/${files[index + 1].replace(/\.mdx$/, "")}` : undefined);
        if (book.anchor === "software-engineering") {
          assert.ok(html.includes("Practical exercise"), "exercise rendered");
          assert.ok(html.includes("Key takeaways"), "takeaways rendered");
          const firstSection = source.match(/^## (.+)$/m)?.[1];
          assert.ok(html.includes(escapeHtml(firstSection)), "chapter body rendered");
        }
      });
    }
  });
}

test("invalid and cross-handbook chapter URLs return 404", async () => {
  for (const path of ["/book/unknown-chapter", "/book/software-engineering/unknown-chapter", "/book/software-engineering/01-Finding-Problems", "/book/14-AgentBench"]) {
    assert.equal((await page(path)).status, 404, path);
  }
});
