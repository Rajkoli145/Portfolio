"use client";

import { useState, useEffect, useRef } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { Terminal, CheckCircle2, Loader2, Zap } from "lucide-react";

const AGENTS = [
  {
    id: "builder",
    name: "builder-bot",
    label: "Builder Bot",
    role: "projects & stack",
    color: "border-cyan-500/60",
    headerBg: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    ringColor: "ring-cyan-500/30",
    glowColor: "shadow-cyan-500/10",
    dotColor: "bg-cyan-400",
    steps: [
      "indexing repositories...",
      "reading package.json files...",
      "analyzing deployment configs...",
      "compiling response...",
    ],
    qa: [
      { q: "ls -la ~/projects", label: "What projects did you build?", a: "built 6 projects — FreelancerFlow (fullstack freelancer platform, JWT + invoice pipeline), EduStory (AI storytelling w/ OpenAI), macOS Portfolio (vanilla JS desktop sim, zero deps), DealVault Escrow (TypeScript state machine), Almost Friday (team collab app), AI Founder Intelligence (LLM market analysis). most are live or in active dev 🔥" },
      { q: "cat tech-stack.json", label: "What's your main tech stack?", a: "react + next.js + typescript frontend / node.js + mongodb + express backend / python for AI pipelines / docker + bash for infra. fullstack and comfortable across the whole thing tbh" },
      { q: "open --live-demos", label: "Any live demos?", a: "freelancer-flow-seven.vercel.app → FreelancerFlow / edu-story.vercel.app → EduStory / rajkoli.vercel.app → macOS portfolio. DealVault + Almost Friday still cooking 👀" },
      { q: "git status --current", label: "What are you building rn?", a: "DealVault Escrow (TypeScript escrow platform), Almost Friday (collab fullstack w/ team), AI Founder Intelligence (startup market signal aggregator). all in active dev simultaneously" },
    ],
  },
  {
    id: "researcher",
    name: "research-bot",
    label: "Research Bot",
    role: "logs & benchmarks",
    color: "border-violet-500/60",
    headerBg: "bg-violet-500/10",
    textColor: "text-violet-400",
    ringColor: "ring-violet-500/30",
    glowColor: "shadow-violet-500/10",
    dotColor: "bg-violet-400",
    steps: [
      "mounting research volume...",
      "parsing 13 benchmark entries...",
      "cross-referencing findings...",
      "compiling response...",
    ],
    qa: [
      { q: "cat research/index.md", label: "What research have you published?", a: "13 logs live at rajkoli-27.vercel.app/research — ZFS forensics, AES-CBC padding oracle, ECDSA nonce bias attacks, Verilog FIFO debugging, orbital mechanics simulation, network C2 forensics, acoustic localisation, vm bytecode exploitation, and more. all hands-on benchmark tasks" },
      { q: "grep -r topics ./logs", label: "What topics do you research?", a: "AI agent evaluation, systems security (crypto attacks, reverse engineering), compiler theory, network forensics, hardware debugging in Verilog, orbital mechanics, and autonomous software systems. pretty wide ngl 🔬" },
      { q: "man tbench-harbor", label: "What's T-Bench / Harbor?", a: "terminal-bench framework for evaluating AI agents on real software engineering tasks — debugging, security audits, data pipelines, systems analysis. i've completed 13 tasks across it, each documented with full findings" },
      { q: "cat handbook/readme.md", label: "What's the Agent Systems Handbook?", a: "book i'm writing on modern AI agent architectures — memory, planning, evaluation, tool use, multi-agent coordination. research-driven not theoretical. deep in progress 📖" },
    ],
  },
  {
    id: "career",
    name: "career-bot",
    label: "Career Bot",
    role: "work & experience",
    color: "border-emerald-500/60",
    headerBg: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    ringColor: "ring-emerald-500/30",
    glowColor: "shadow-emerald-500/10",
    dotColor: "bg-emerald-400",
    steps: [
      "loading work history...",
      "scanning 6 positions...",
      "analyzing achievements...",
      "compiling response...",
    ],
    qa: [
      { q: "cat resume/experience.json", label: "Where have you worked?", a: "Handshake AI → AI eval specialist (Jul 2026–present) / Parsewave → AI benchmark contributor (Jun 2026–present) / RustChain → open source CLI contributor, bounty winner / La Tanda → TypeScript SDK dev / Hiero SDK → Python contributor, v0.2.2 release / Unified Mentor → frontend intern (4 months)" },
      { q: "top --skills", label: "What's your strongest skill?", a: "backend systems + AI agent infra — REST APIs, CLI tooling, linux automation, evaluation pipelines. but comfortable fullstack and can ship across the whole stack tbh" },
      { q: "ping opportunities", label: "Are you open to work?", a: "yeah always open to the right thing — remote preferred, interesting problems only. hit me at koliraj911@gmail.com or linkedin.com/in/raj-koli-626008318" },
      { q: "git log --achievements", label: "What's your biggest achievement?", a: "PR merged into Hiero SDK official v0.2.2 release + awarded a bounty on first RustChain PR. open source wins hit different fr 🏆" },
    ],
  },
];

function useTypewriter(text: string, active: boolean, speed = 14) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text || !active) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, active]);

  return { displayed, done };
}

function ProcessingSteps({ steps, onDone, textColor }: { steps: string[]; onDone: () => void; textColor: string }) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    if (current >= steps.length) { onDone(); return; }
    const t = setTimeout(() => {
      setDone((d) => [...d, current]);
      setCurrent((c) => c + 1);
    }, 420);
    return () => clearTimeout(t);
  }, [current, steps.length]);

  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, i) => {
        const isDone = done.includes(i);
        const isActive = current === i;
        if (i > current) return null;
        return (
          <div key={step} className="flex items-center gap-2 text-xs font-mono">
            {isDone ? (
              <CheckCircle2 className={cn("size-3 shrink-0", textColor)} />
            ) : (
              <Loader2 className="size-3 shrink-0 text-muted-foreground animate-spin" />
            )}
            <span className={isDone ? "text-muted-foreground" : "text-foreground"}>{step}</span>
            {isDone && <span className="ml-auto text-muted-foreground/40 text-[10px]">{(i + 1) * 0.4}s</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function AgentsPage() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [activeQ, setActiveQ] = useState<{ q: string; label: string; a: string } | null>(null);
  const [phase, setPhase] = useState<"idle" | "processing" | "answer">("idle");
  const termRef = useRef<HTMLDivElement>(null);

  const agent = AGENTS.find((a) => a.id === activeAgent);
  const { displayed, done: typeDone } = useTypewriter(activeQ?.a ?? "", phase === "answer");

  const handleQ = (agentId: string, item: { q: string; label: string; a: string }) => {
    setActiveAgent(agentId);
    setActiveQ(item);
    setPhase("processing");
    setTimeout(() => termRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 pb-32 px-6 sm:py-24">
      <BlurFade delay={0.04}>
        <div className="flex flex-col items-center text-center gap-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">
            <Zap className="size-3.5" />
            <span>AI Agents</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Meet Raj's AI Crew</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Run a command. Watch the agent work. Get the answer.
          </p>
        </div>
      </BlurFade>

      {/* Agent terminal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {AGENTS.map((ag, i) => {
          const isActive = activeAgent === ag.id;
          return (
            <BlurFade key={ag.id} delay={0.08 + i * 0.06}>
              <div className={cn(
                "rounded-xl border bg-[#0d0d0d] overflow-hidden transition-all duration-300 shadow-lg",
                ag.glowColor,
                isActive ? ag.color : "border-border/40 hover:border-border/80"
              )}>
                {/* Terminal title bar */}
                <div className={cn("flex items-center gap-2 px-4 py-2.5 border-b border-border/40", isActive ? ag.headerBg : "bg-muted/5")}>
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-red-500/60" />
                    <div className="size-2.5 rounded-full bg-yellow-500/60" />
                    <div className="size-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex items-center gap-1.5 ml-1">
                    <Terminal className={cn("size-3", ag.textColor)} />
                    <span className={cn("text-[11px] font-mono font-semibold", ag.textColor)}>{ag.name}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className={cn("size-1.5 rounded-full animate-pulse", ag.dotColor)} />
                    <span className="text-[10px] font-mono text-muted-foreground">{ag.role}</span>
                  </div>
                </div>

                {/* Commands */}
                <div className="p-3 flex flex-col gap-1">
                  {ag.qa.map((item) => {
                    const isSelected = activeQ?.q === item.q && activeAgent === ag.id;
                    return (
                      <button
                        key={item.q}
                        onClick={() => handleQ(ag.id, item)}
                        className={cn(
                          "text-left font-mono text-[11px] px-3 py-2 rounded-lg border transition-all group",
                          isSelected
                            ? cn("border-opacity-60 bg-muted/30", ag.color)
                            : "border-border/30 hover:border-border/60 bg-transparent hover:bg-muted/10"
                        )}
                      >
                        <span className={cn("mr-1.5", ag.textColor)}>$</span>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.q}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </BlurFade>
          );
        })}
      </div>

      {/* Terminal output */}
      {activeAgent && activeQ && agent && (
        <BlurFade delay={0} key={`${activeAgent}-${activeQ.q}`}>
          <div
            ref={termRef}
            className={cn(
              "rounded-xl border bg-[#0a0a0a] overflow-hidden shadow-xl transition-all",
              agent.glowColor,
              agent.color
            )}
          >
            {/* Title bar */}
            <div className={cn("flex items-center gap-2 px-4 py-2.5 border-b border-border/40", agent.headerBg)}>
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-500/60" />
                <div className="size-2.5 rounded-full bg-yellow-500/60" />
                <div className="size-2.5 rounded-full bg-green-500/60" />
              </div>
              <Terminal className={cn("size-3 ml-1", agent.textColor)} />
              <span className={cn("text-[11px] font-mono font-semibold", agent.textColor)}>{agent.name} — output</span>
              <span className="ml-auto text-[10px] font-mono text-muted-foreground">{activeQ.label}</span>
            </div>

            <div className="p-5 font-mono text-xs space-y-4">
              {/* Query line */}
              <div>
                <span className={cn("mr-2", agent.textColor)}>$</span>
                <span className="text-foreground">{activeQ.q}</span>
              </div>

              {/* Processing steps */}
              {(phase === "processing" || phase === "answer") && (
                <div className="pl-4 border-l border-border/30 space-y-1">
                  <ProcessingSteps
                    steps={agent.steps}
                    textColor={agent.textColor}
                    onDone={() => setPhase("answer")}
                  />
                </div>
              )}

              {/* Answer */}
              {phase === "answer" && (
                <div className="space-y-1">
                  <div className="text-muted-foreground/50 text-[10px] uppercase tracking-widest mb-2">— response —</div>
                  <p className={cn("leading-relaxed", agent.textColor)}>
                    {displayed}
                    {!typeDone && (
                      <span className="animate-pulse inline-block w-[2px] h-[11px] bg-current align-middle ml-0.5" />
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </BlurFade>
      )}
    </div>
  );
}
