export interface Note {
    id: string;
    title: string;
    date: string;
    preview: string;
    content: string;
}

export const NOTES: Note[] = [
    {
        id: "1",
        title: "Building Founder Agent",
        date: "Today at 9:41 AM",
        preview: "A deep dive into the architecture of Founder Agent...",
        content: `
# Building Founder Agent

Founder Agent is designed to be an autonomous AI that helps startup founders execute on their ideas. 

## The Core Loop
1. **Perception**: The agent reads the user's request.
2. **Planning**: It breaks the request down into actionable steps.
3. **Execution**: It writes code, creates marketing copy, or researches competitors.

> "The true power of an agent lies not in its reasoning, but in its ability to interact with the environment."

### Key Technologies
- **Next.js** for the frontend
- **Zustand** for state management
- **Vercel AI SDK** for model routing

Here is a snippet of how the execution engine works:

\`\`\`typescript
async function executeTask(task: Task) {
    console.log("Executing:", task.name);
    const result = await agent.run(task);
    return result;
}
\`\`\`
`
    },
    {
        id: "2",
        title: "Why I use Next.js",
        date: "Yesterday",
        preview: "Next.js provides the perfect balance of static generation and server-side rendering.",
        content: `
# Why I use Next.js

Over the past few years, I've built dozens of applications. Next.js has consistently been my go-to framework.

## 1. Server Components
React Server Components (RSC) fundamentally changed how we build React applications. By keeping the heavy lifting on the server, we send zero JS to the client for purely presentational components.

## 2. Routing
The App Router is intuitive. Nested layouts allow for complex UIs without prop drilling or complex context providers.

## 3. Ecosystem
Being backed by Vercel means the deployment story is unmatched. Edge functions, ISR, and image optimization work out of the box.
`
    },
    {
        id: "3",
        title: "Terminal Agent Workflow",
        date: "July 12, 2026",
        preview: "How to design hard CLI tasks for tools like T-Bench.",
        content: `
# Terminal Agent Workflow

Evaluating AI agents is hard. Benchmarks get saturated quickly. That's why building robust CLI tasks for frameworks like **T-Bench** is critical.

## Designing a Good Task
A good benchmark task should:
1. Have a clear success criteria.
2. Not be easily solvable by a simple Google search.
3. Require multi-step reasoning.

For example, asking an agent to debug a complex regex issue in a bash script:

\`\`\`bash
#!/bin/bash
# Find all IP addresses in a log file
grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" access.log
\`\`\`

Agents often struggle with escaping characters properly in different shell environments.
`
    }
];
