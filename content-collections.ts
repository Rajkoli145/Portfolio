import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { remarkCodeMeta } from "./src/lib/remark-code-meta";

const research = defineCollection({
    name: "research",
    directory: "research/entries",
    include: "**/*.{md,mdx}",
    schema: z.object({
        title: z.string(),
        createdAt: z.string().optional(),
        publishedAt: z.string().optional(),
        updatedAt: z.string().optional(),
        project: z.string().default("failure-recovery-benchmark"),
        tags: z.array(z.string()).default(["research-notes"]),
        status: z.enum(["draft", "published"]).default("published"),
        summary: z.string().optional(),
        content: z.string(),
    }),
    transform: async (document, context) => {
        const mdx = await compileMDX(context, document, {
            remarkPlugins: [remarkGfm, remarkCodeMeta],
        });
        return {
            ...document,
            mdx,
        };
    },
});

export default defineConfig({
    collections: [research],
});
