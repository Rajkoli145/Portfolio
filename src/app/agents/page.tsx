"use client";

import { useState, useEffect, useRef } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";

// ── Network topology (SVG viewBox 0 0 100 50) ──────────────────────────────
const NODES = [
  { id: "i1",       x: 4,   y: 18, r: 1.2, type: "io"    },
  { id: "i2",       x: 4,   y: 38, r: 1.2, type: "io"    },
  { id: "builder",  x: 20,  y: 14, r: 4.2, type: "agent", label: "Builder",  agentId: "builder"    },
  { id: "h1",       x: 18,  y: 34, r: 1.8, type: "hidden" },
  { id: "h2",       x: 36,  y: 22, r: 2.2, type: "hidden" },
  { id: "h3",       x: 34,  y: 42, r: 1.6, type: "hidden" },
  { id: "research", x: 52,  y: 14, r: 4.2, type: "agent", label: "Research", agentId: "researcher" },
  { id: "h4",       x: 54,  y: 38, r: 2.0, type: "hidden" },
  { id: "h5",       x: 68,  y: 26, r: 1.8, type: "hidden" },
  { id: "career",   x: 80,  y: 14, r: 4.2, type: "agent", label: "Career",   agentId: "career"     },
  { id: "h6",       x: 78,  y: 38, r: 1.6, type: "hidden" },
  { id: "o1",       x: 96,  y: 20, r: 1.2, type: "io"    },
  { id: "o2",       x: 96,  y: 38, r: 1.2, type: "io"    },
];

const EDGES = [
  { id: "e1",  from: "i1",       to: "builder"  },
  { id: "e2",  from: "i2",       to: "h1"       },
  { id: "e3",  from: "builder",  to: "h1"       },
  { id: "e4",  from: "builder",  to: "h2"       },
  { id: "e5",  from: "h1",       to: "h3"       },
  { id: "e6",  from: "h1",       to: "h2"       },
  { id: "e7",  from: "h2",       to: "research" },
  { id: "e8",  from: "h3",       to: "h4"       },
  { id: "e9",  from: "research", to: "h4"       },
  { id: "e10", from: "research", to: "h5"       },
  { id: "e11", from: "research", to: "career"   },
  { id: "e12", from: "h4",       to: "h6"       },
  { id: "e13", from: "h5",       to: "career"   },
  { id: "e14", from: "career",   to: "h6"       },
  { id: "e15", from: "career",   to: "o1"       },
  { id: "e16", from: "h6",       to: "o2"       },
];

const SIGNAL_CONFIGS = [
  { edgeId: "e1",  dur: 3.2, begin: 0    },
  { edgeId: "e2",  dur: 4.1, begin: 1.5  },
  { edgeId: "e3",  dur: 2.8, begin: 0.8  },
  { edgeId: "e4",  dur: 3.6, begin: 2.2  },
  { edgeId: "e5",  dur: 4.4, begin: 0.3  },
  { edgeId: "e6",  dur: 2.9, begin: 3.1  },
  { edgeId: "e7",  dur: 3.3, begin: 1.0  },
  { edgeId: "e8",  dur: 4.0, begin: 2.7  },
  { edgeId: "e9",  dur: 3.1, begin: 0.5  },
  { edgeId: "e10", dur: 2.7, begin: 1.8  },
  { edgeId: "e11", dur: 3.8, begin: 0.9  },
  { edgeId: "e12", dur: 4.2, begin: 3.4  },
  { edgeId: "e13", dur: 3.0, begin: 2.0  },
  { edgeId: "e14", dur: 3.5, begin: 1.2  },
  { edgeId: "e15", dur: 2.6, begin: 0.4  },
  { edgeId: "e16", dur: 4.3, begin: 2.9  },
];

// ── Agent Q&A data ──────────────────────────────────────────────────────────
const AGENTS: Record<string, { label: string; color: string; qa: { q: string; a: string }[] }> = {
  builder: {
    label: "Builder",
    color: "#e2e8f0",
    qa: [
      { q: "What projects have you built?", a: "6 projects — FreelancerFlow (fullstack freelancer platform, JWT + invoice pipeline), EduStory (AI storytelling w/ OpenAI), macOS Portfolio (vanilla JS desktop sim, zero deps), DealVault Escrow (TypeScript state machine), Almost Friday (team collab app), AI Founder Intelligence (LLM market analysis). most are live or in active dev" },
      { q: "What's your tech stack?", a: "react + next.js + typescript frontend / node.js + mongodb + express backend / python for AI pipelines / docker + bash for infra. comfortable across the full stack" },
      { q: "Any live demos?", a: "freelancer-flow-seven.vercel.app → FreelancerFlow / edu-story.vercel.app → EduStory / rajkoli.vercel.app → macOS portfolio. DealVault + Almost Friday still in progress" },
      { q: "What are you building right now?", a: "DealVault Escrow (TypeScript escrow platform), Almost Friday (collab fullstack with a team), AI Founder Intelligence (startup market signal aggregator). all in active development simultaneously" },
    ],
  },
  researcher: {
    label: "Research",
    color: "#e2e8f0",
    qa: [
      { q: "What research have you published?", a: "13 logs live at rajkoli-27.vercel.app/research — ZFS forensics, AES-CBC padding oracle, ECDSA nonce bias attacks, Verilog FIFO debugging, orbital mechanics simulation, network C2 forensics, acoustic localisation, VM bytecode exploitation and more. all hands-on benchmark tasks" },
      { q: "What topics do you cover?", a: "AI agent evaluation, systems security (crypto attacks, reverse engineering), compiler theory, network forensics, hardware debugging in Verilog, orbital mechanics, autonomous software systems. wide range" },
      { q: "What's T-Bench / Harbor?", a: "terminal-bench framework for evaluating AI agents on real software engineering tasks — debugging, security audits, data pipelines, systems analysis. completed 13 tasks across it, each documented with full findings" },
      { q: "What's the Agent Systems Handbook?", a: "book on modern AI agent architectures — memory, planning, evaluation, tool use, multi-agent coordination. research-driven, not theoretical fluff. deep in progress" },
    ],
  },
  career: {
    label: "Career",
    color: "#e2e8f0",
    qa: [
      { q: "Where have you worked?", a: "Handshake AI → AI eval specialist (Jul 2026–present) / Parsewave → AI benchmark contributor (Jun 2026–present) / RustChain → open source CLI contributor, bounty winner / La Tanda → TypeScript SDK dev / Hiero SDK → Python contributor, v0.2.2 release / Unified Mentor → frontend intern (4 months)" },
      { q: "What's your strongest skill?", a: "backend systems + AI agent infra — REST APIs, CLI tooling, Linux automation, evaluation pipelines. comfortable fullstack and can ship across the entire stack" },
      { q: "Are you open to opportunities?", a: "yeah, always open to the right thing. remote preferred, interesting problems only. reach me at koliraj911@gmail.com or linkedin.com/in/raj-koli-626008318" },
      { q: "What's your biggest win?", a: "PR merged into Hiero SDK official v0.2.2 release + awarded a bounty on first RustChain PR submission. also a paid benchmark contribution at Parsewave that passed full technical review" },
    ],
  },
};

// ── Typewriter hook ─────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 16) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return { out, done };
}

// ── SVG Network ─────────────────────────────────────────────────────────────
function Network({ activeAgentId }: { activeAgentId: string | null }) {
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  return (
    <svg
      viewBox="0 0 100 50"
      className="w-full"
      style={{ height: "clamp(200px, 38vw, 340px)" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glow-agent" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-signal" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {EDGES.map(e => {
          const a = nodeMap[e.from]; const b = nodeMap[e.to];
          return (
            <path
              key={`path-${e.id}`}
              id={`path-${e.id}`}
              d={`M${a.x},${a.y} L${b.x},${b.y}`}
              fill="none"
            />
          );
        })}
      </defs>

      {/* Edges */}
      {EDGES.map(e => {
        const a = nodeMap[e.from]; const b = nodeMap[e.to];
        const isActive = activeAgentId && (
          a.agentId === activeAgentId || b.agentId === activeAgentId
        );
        return (
          <line
            key={e.id}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="white"
            strokeWidth="0.18"
            strokeOpacity={isActive ? 0.28 : 0.1}
            style={{ transition: "stroke-opacity 0.6s ease" }}
          />
        );
      })}

      {/* Traveling signals */}
      {SIGNAL_CONFIGS.map(cfg => {
        const edge = EDGES.find(e => e.id === cfg.edgeId)!;
        const a = nodeMap[edge.from]; const b = nodeMap[edge.to];
        const isActive = activeAgentId && (
          a.agentId === activeAgentId || b.agentId === activeAgentId
        );
        return (
          <circle
            key={cfg.edgeId}
            r="0.6"
            fill="white"
            opacity={isActive ? 0.85 : 0.35}
            filter="url(#glow-signal)"
            style={{ transition: "opacity 0.5s ease" }}
          >
            <animateMotion
              dur={`${isActive ? cfg.dur * 0.55 : cfg.dur}s`}
              repeatCount="indefinite"
              begin={`${cfg.begin}s`}
            >
              <mpath href={`#path-${cfg.edgeId}`} />
            </animateMotion>
          </circle>
        );
      })}

      {/* Nodes */}
      {NODES.map(n => {
        const isActiveAgent = n.type === "agent" && n.agentId === activeAgentId;
        const isAgent = n.type === "agent";

        return (
          <g key={n.id}>
            {isActiveAgent && (
              <>
                <circle
                  cx={n.x} cy={n.y} r={n.r + 3}
                  fill="white" fillOpacity={0.04}
                  stroke="white" strokeOpacity={0.12} strokeWidth="0.2"
                >
                  <animate attributeName="r" values={`${n.r+2};${n.r+4.5};${n.r+2}`} dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values="0.04;0.01;0.04" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx={n.x} cy={n.y} r={n.r + 1.2}
                  fill="none"
                  stroke="white" strokeOpacity={0.2} strokeWidth="0.25"
                >
                  <animate attributeName="r" values={`${n.r+1};${n.r+2.5};${n.r+1}`} dur="1.8s" repeatCount="indefinite" />
                </circle>
              </>
            )}

            <circle
              cx={n.x} cy={n.y} r={n.r}
              fill={isActiveAgent ? "white" : isAgent ? "white" : "white"}
              fillOpacity={
                isActiveAgent ? 0.95 :
                isAgent ? 0.55 :
                n.type === "io" ? 0.25 :
                0.3
              }
              filter={isAgent ? "url(#glow-agent)" : undefined}
              style={{ transition: "fill-opacity 0.5s ease" }}
            />

            {isAgent && (
              <text
                x={n.x}
                y={n.y + n.r + 2.4}
                textAnchor="middle"
                fontSize="2.2"
                fill="white"
                fillOpacity={isActiveAgent ? 0.9 : 0.45}
                fontFamily="system-ui, sans-serif"
                fontWeight={isActiveAgent ? "600" : "400"}
                style={{ transition: "fill-opacity 0.5s ease" }}
              >
                {n.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [activeQ, setActiveQ] = useState<{ q: string; a: string } | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const { out, done } = useTypewriter(activeQ?.a ?? "");

  const handleQ = (agentId: string, item: { q: string; a: string }) => {
    setActiveAgentId(agentId);
    setActiveQ(item);
    setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
  };

  return (
    <div
      className="min-h-screen pb-32"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #0f0f1a 0%, #080810 60%, #050508 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-6 pt-16 sm:pt-24">

        <BlurFade delay={0.04}>
          <div className="text-center mb-10">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/30 mb-3">Neural Agent Network</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white/90">
              Ask About Me
            </h1>
            <p className="text-sm text-white/30 mt-3">select a question — watch the network respond</p>
          </div>
        </BlurFade>

        {/* Neural network */}
        <BlurFade delay={0.08}>
          <div className="mb-10 px-2">
            <Network activeAgentId={activeAgentId} />
          </div>
        </BlurFade>

        {/* Question columns */}
        <BlurFade delay={0.12}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {Object.entries(AGENTS).map(([id, agent]) => (
              <div key={id} className="flex flex-col gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 mb-1 text-center">
                  {agent.label} Agent
                </p>
                {agent.qa.map(item => {
                  const isActive = activeAgentId === id && activeQ?.q === item.q;
                  return (
                    <button
                      key={item.q}
                      onClick={() => handleQ(id, item)}
                      className={cn(
                        "text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all duration-300",
                        isActive
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-white/8 bg-white/3 text-white/45 hover:text-white/70 hover:border-white/15 hover:bg-white/6"
                      )}
                    >
                      {item.q}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </BlurFade>

        {/* Answer */}
        {activeQ && (
          <BlurFade delay={0} key={activeQ.q}>
            <div
              ref={answerRef}
              className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm px-7 py-6"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-4">
                {AGENTS[activeAgentId!]?.label} · response
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-white/80 font-light">
                {out}
                {!done && (
                  <span className="inline-block w-[2px] h-[14px] bg-white/60 align-middle ml-0.5 animate-pulse" />
                )}
              </p>
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  );
}
