"use client";

import { useState, useEffect, useRef } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { Hammer, FlaskConical, Briefcase, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const AGENTS = [
  {
    id: "builder",
    name: "Builder Bot",
    role: "Projects & Stack",
    icon: Hammer,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "hover:border-blue-500/50 data-[active=true]:border-blue-500/70",
    glow: "shadow-blue-500/20",
    dot: "bg-blue-400",
    accent: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    qa: [
      {
        q: "What projects have you built?",
        a: "built 6 projects — FreelancerFlow (freelancer platform w/ JWT + invoice pipeline), EduStory (AI storytelling w/ OpenAI), macOS Portfolio (vanilla JS desktop sim, zero deps), DealVault Escrow (TypeScript escrow platform), Almost Friday (team fullstack app), and AI Founder Intelligence (LLM market analysis). most are live or in active dev 🔥",
      },
      {
        q: "What's your main tech stack?",
        a: "react + next.js + typescript on the frontend, node.js + mongodb + express on backend, python for AI pipelines, docker + bash for infra stuff. lowkey comfortable across the whole stack tbh",
      },
      {
        q: "Any live demos?",
        a: "yeah — FreelancerFlow at freelancer-flow-seven.vercel.app, EduStory at edu-story.vercel.app, and the macOS portfolio at rajkoli.vercel.app. DealVault + Almost Friday still cooking 👀",
      },
      {
        q: "What are you building right now?",
        a: "DealVault Escrow (production TypeScript escrow platform), Almost Friday (collab fullstack w/ a team), and AI Founder Intelligence (market signal aggregator for founders). all in active dev rn",
      },
    ],
  },
  {
    id: "researcher",
    name: "Research Bot",
    role: "Logs & Benchmarks",
    icon: FlaskConical,
    color: "from-violet-500/20 to-purple-500/20",
    border: "hover:border-violet-500/50 data-[active=true]:border-violet-500/70",
    glow: "shadow-violet-500/20",
    dot: "bg-violet-400",
    accent: "text-violet-400",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    qa: [
      {
        q: "What research have you published?",
        a: "13 research logs live at rajkoli-27.vercel.app/research — covers ZFS forensics, AES-CBC padding oracle, ECDSA nonce bias attacks, Verilog FIFO debugging, orbital mechanics simulation, network C2 forensics, acoustic source localisation and more. all hands-on benchmark tasks",
      },
      {
        q: "What topics do you research?",
        a: "AI agent evaluation, systems security (crypto attacks, reverse engineering), compiler theory, network forensics, hardware debugging (Verilog), orbital mechanics, and autonomous software systems. pretty wide range ngl 🔬",
      },
      {
        q: "What's the T-Bench / Harbor Framework?",
        a: "terminal-bench framework for evaluating AI agents on real software engineering tasks — debugging, security audits, systems analysis. i've done 13 tasks across it covering security, hardware, data pipelines, and more",
      },
      {
        q: "What is the Agent Systems Handbook?",
        a: "book i'm writing covering modern AI agent architectures — memory, planning, evaluation, tool use, multi-agent coordination. research-driven, not theoretical fluff. still in progress but it's getting deep 📖",
      },
    ],
  },
  {
    id: "career",
    name: "Career Bot",
    role: "Work & Experience",
    icon: Briefcase,
    color: "from-emerald-500/20 to-green-500/20",
    border: "hover:border-emerald-500/50 data-[active=true]:border-emerald-500/70",
    glow: "shadow-emerald-500/20",
    dot: "bg-emerald-400",
    accent: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    qa: [
      {
        q: "Where have you worked?",
        a: "Handshake AI (AI eval specialist, Jul 2026–present), Parsewave (AI benchmark contributor, Jun 2026–present), RustChain (open source CLI contributor, bounty winner), La Tanda (TypeScript SDK dev), Hiero SDK (Python contributor, v0.2.2 release), Unified Mentor (frontend intern, 4 months)",
      },
      {
        q: "What's your strongest skill?",
        a: "backend systems + AI agent infra honestly — REST APIs, CLI tooling, linux automation, evaluation pipelines. but i'm comfortable fullstack and can ship across the whole thing",
      },
      {
        q: "Are you open to opportunities?",
        a: "yeah always open to the right thing — remote preferred, interesting problems only. hit me at koliraj911@gmail.com or linkedin.com/in/raj-koli-626008318",
      },
      {
        q: "What's your biggest achievement?",
        a: "tbh getting a PR merged into Hiero SDK's official v0.2.2 release + awarded a bounty on my first RustChain PR submission. open source wins hit different fr",
      },
    ],
  },
];

function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

export default function AgentsPage() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [activeAnswer, setActiveAnswer] = useState("");
  const [activeQ, setActiveQ] = useState("");
  const answerRef = useRef<HTMLDivElement>(null);
  const { displayed, done } = useTypewriter(activeAnswer);

  const handleQ = (agentId: string, q: string, a: string) => {
    setActiveAgent(agentId);
    setActiveQ(q);
    setActiveAnswer(a);
    setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  };

  const agent = AGENTS.find((a) => a.id === activeAgent);

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
            Pick an agent. Ask a question. Get an answer instantly.
          </p>
        </div>
      </BlurFade>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {AGENTS.map((agent, i) => {
          const Icon = agent.icon;
          const isActive = activeAgent === agent.id;
          return (
            <BlurFade key={agent.id} delay={0.08 + i * 0.06}>
              <div
                data-active={isActive}
                className={cn(
                  "rounded-2xl border bg-card p-5 flex flex-col gap-4 transition-all duration-300 cursor-default",
                  `shadow-lg ${agent.glow}`,
                  agent.border,
                  isActive && `bg-gradient-to-br ${agent.color}`
                )}
              >
                {/* Agent header */}
                <div className="flex items-center gap-3">
                  <div className={cn("size-10 rounded-xl flex items-center justify-center bg-gradient-to-br", agent.color, "border border-border")}>
                    <Icon className={cn("size-5", agent.accent)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">{agent.name}</span>
                      <span className={cn("relative flex size-1.5")}>
                        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", agent.dot)} />
                        <span className={cn("relative inline-flex rounded-full size-1.5", agent.dot)} />
                      </span>
                    </div>
                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", agent.badge)}>
                      {agent.role}
                    </span>
                  </div>
                </div>

                {/* Questions */}
                <div className="flex flex-col gap-1.5">
                  {agent.qa.map((item) => (
                    <button
                      key={item.q}
                      onClick={() => handleQ(agent.id, item.q, item.a)}
                      className={cn(
                        "text-left text-xs px-3 py-2 rounded-lg border border-border/60 bg-background/60 hover:bg-muted transition-all flex items-center gap-2 group",
                        activeQ === item.q && activeAgent === agent.id && `border-opacity-100 bg-muted`
                      )}
                    >
                      <ChevronRight className={cn("size-3 shrink-0 transition-transform group-hover:translate-x-0.5", agent.accent)} />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </BlurFade>
          );
        })}
      </div>

      {/* Answer area */}
      {activeAgent && (
        <BlurFade delay={0}>
          <div
            ref={answerRef}
            className={cn(
              "rounded-2xl border bg-card p-6 shadow-lg transition-all",
              agent && `shadow-lg ${agent.glow}`
            )}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              {agent && (
                <>
                  <div className={cn("size-6 rounded-lg flex items-center justify-center bg-gradient-to-br", agent.color)}>
                    {agent && <agent.icon className={cn("size-3.5", agent.accent)} />}
                  </div>
                  <span className="text-xs font-semibold">{agent.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto font-mono">{activeQ}</span>
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed text-foreground font-mono">
              {displayed}
              {!done && <span className="animate-pulse ml-0.5 inline-block w-[2px] h-[14px] bg-primary align-middle" />}
            </p>
          </div>
        </BlurFade>
      )}
    </div>
  );
}
