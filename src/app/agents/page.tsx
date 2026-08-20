"use client";

import { useState, useEffect, useMemo } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";

// ── Network layout ──────────────────────────────────────────────────────────
const VW = 680;
const VH = 360;

const LAYERS = [
  {
    id: "input",
    x: 60,
    nodes: [
      { id: "i0", y: 80  },
      { id: "i1", y: 148 },
      { id: "i2", y: 216 },
      { id: "i3", y: 284 },
    ],
  },
  {
    id: "agents",
    x: 210,
    nodes: [
      { id: "builder",    y: 100, label: "Builder",  agentId: "builder"    },
      { id: "researcher", y: 192, label: "Research", agentId: "researcher" },
      { id: "career",     y: 284, label: "Career",   agentId: "career"     },
    ],
  },
  {
    id: "hidden",
    x: 390,
    nodes: [
      { id: "h0", y: 64  },
      { id: "h1", y: 140 },
      { id: "h2", y: 210 },
      { id: "h3", y: 280 },
      { id: "h4", y: 328 },
    ],
  },
  {
    id: "output",
    x: 580,
    nodes: [
      { id: "o0", y: 144, label: "Output" },
      { id: "o1", y: 228 },
    ],
  },
];

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2;
  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
}

// Build all edges between adjacent layers
const EDGES: { id: string; path: string; fromLayer: number; toLayer: number }[] = [];
for (let li = 0; li < LAYERS.length - 1; li++) {
  const layerA = LAYERS[li];
  const layerB = LAYERS[li + 1];
  layerA.nodes.forEach((a) => {
    layerB.nodes.forEach((b) => {
      EDGES.push({
        id: `${a.id}-${b.id}`,
        path: bezier(layerA.x, a.y, layerB.x, b.y),
        fromLayer: li,
        toLayer: li + 1,
      });
    });
  });
}

// Signal configs per edge: random delays so they feel organic
const SIGNALS = EDGES.map((e, i) => ({
  edgeId: e.id,
  dur: 2.4 + (i % 7) * 0.35,
  begin: (i * 0.41) % 3.5,
  path: e.path,
}));

// ── Agent data ──────────────────────────────────────────────────────────────
const AGENTS: Record<string, { label: string; nodeId: string; qa: { q: string; a: string }[] }> = {
  builder: {
    label: "Builder",
    nodeId: "builder",
    qa: [
      { q: "What projects have you built?", a: "6 projects — FreelancerFlow (fullstack freelancer platform, JWT + invoice pipeline), EduStory (AI storytelling w/ OpenAI), macOS Portfolio (vanilla JS desktop sim, zero deps), DealVault Escrow (TypeScript state machine), Almost Friday (team collab app), AI Founder Intelligence (LLM market analysis). most are live or in active dev." },
      { q: "What's your tech stack?", a: "React + Next.js + TypeScript frontend / Node.js + MongoDB + Express backend / Python for AI pipelines / Docker + Bash for infra. comfortable across the full stack." },
      { q: "Any live demos?", a: "freelancer-flow-seven.vercel.app → FreelancerFlow / edu-story.vercel.app → EduStory / rajkoli.vercel.app → macOS portfolio. DealVault + Almost Friday still in active development." },
      { q: "What are you building right now?", a: "DealVault Escrow (TypeScript escrow platform), Almost Friday (collaborative fullstack with a team), and AI Founder Intelligence (startup market signal aggregator). all running in parallel." },
    ],
  },
  researcher: {
    label: "Research",
    nodeId: "researcher",
    qa: [
      { q: "What research have you published?", a: "13 logs live at rajkoli-27.vercel.app/research — ZFS forensics, AES-CBC padding oracle, ECDSA nonce bias attacks, Verilog FIFO debugging, orbital mechanics simulation, network C2 forensics, acoustic localisation, VM bytecode exploitation and more." },
      { q: "What topics do you cover?", a: "AI agent evaluation, systems security (crypto attacks, reverse engineering), compiler theory, network forensics, hardware debugging in Verilog, orbital mechanics, and autonomous software systems." },
      { q: "What's T-Bench / Harbor?", a: "A terminal-bench framework for evaluating AI agents on real software engineering tasks — debugging, security audits, data pipelines, systems analysis. I've completed 13 tasks across it, each documented with full findings." },
      { q: "What's the Agent Systems Handbook?", a: "A book on modern AI agent architectures — memory, planning, evaluation, tool use, multi-agent coordination. Research-driven, not theoretical. Deep in progress." },
    ],
  },
  career: {
    label: "Career",
    nodeId: "career",
    qa: [
      { q: "Where have you worked?", a: "Handshake AI → AI eval specialist (Jul 2026–present) / Parsewave → AI benchmark contributor (Jun 2026–present) / RustChain → open source CLI, bounty winner / La Tanda → TypeScript SDK dev / Hiero SDK → Python contributor v0.2.2 / Unified Mentor → frontend intern (4 months)." },
      { q: "What's your strongest skill?", a: "Backend systems + AI agent infra — REST APIs, CLI tooling, Linux automation, evaluation pipelines. Comfortable fullstack and can ship across the entire stack." },
      { q: "Are you open to opportunities?", a: "Yes, always open to the right thing. Remote preferred, interesting problems only. Reach me at koliraj911@gmail.com or linkedin.com/in/raj-koli-626008318." },
      { q: "What's your biggest win?", a: "PR merged into Hiero SDK official v0.2.2 release + awarded a bounty on my first RustChain PR. Also a paid benchmark contribution at Parsewave that passed full technical review." },
    ],
  },
};

// ── Typewriter ──────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 14) {
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

// ── Network SVG ─────────────────────────────────────────────────────────────
function NetworkSVG({ activeAgentId }: { activeAgentId: string | null }) {
  const nodeMap = useMemo(() => {
    const m: Record<string, { x: number; y: number; label?: string; agentId?: string }> = {};
    LAYERS.forEach(l => l.nodes.forEach(n => m[n.id] = { x: l.x, y: n.y, label: (n as any).label, agentId: (n as any).agentId }));
    return m;
  }, []);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full text-foreground" style={{ height: "clamp(220px, 42vw, 360px)" }}>
      <defs>
        {/* Node glow filter */}
        <filter id="ng" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sg" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Define all edge paths for animateMotion */}
        {SIGNALS.map(s => (
          <path key={`def-${s.edgeId}`} id={`ep-${s.edgeId}`} d={s.path} fill="none" />
        ))}
      </defs>

      {/* Layer labels */}
      {[
        { x: 60,  label: "INPUT"  },
        { x: 210, label: "AGENTS" },
        { x: 390, label: "HIDDEN" },
        { x: 580, label: "OUTPUT" },
      ].map(l => (
        <text key={l.label} x={l.x} y={22} textAnchor="middle"
          fontSize="7" fill="currentColor" fillOpacity={0.2}
          fontFamily="system-ui" fontWeight="600" letterSpacing="2">
          {l.label}
        </text>
      ))}

      {/* Edges */}
      {EDGES.map(e => {
        const fromNode = nodeMap[e.id.split("-")[0]];
        const isAgentEdge = fromNode?.agentId === activeAgentId || (e.toLayer === 1 && nodeMap[LAYERS[1].nodes.find(n => (n as any).agentId === activeAgentId)?.id ?? ""]?.y !== undefined);
        const active = !!activeAgentId;
        return (
          <path
            key={e.id}
            d={e.path}
            fill="none"
            stroke="currentColor"
            strokeWidth={active ? "0.6" : "0.4"}
            strokeOpacity={active ? 0.18 : 0.09}
            style={{ transition: "stroke-opacity 0.7s, stroke-width 0.7s" }}
          />
        );
      })}

      {/* Traveling signals */}
      {SIGNALS.map((s, i) => {
        const active = !!activeAgentId;
        return (
          <g key={s.edgeId}>
            <circle
              r={active ? "1.4" : "0.9"}
              fill="currentColor"
              opacity={active ? 0.7 : 0.25}
              filter="url(#sg)"
              style={{ transition: "opacity 0.5s, r 0.5s" }}
            >
              <animateMotion
                dur={`${active ? s.dur * 0.5 : s.dur}s`}
                repeatCount="indefinite"
                begin={`${s.begin}s`}
              >
                <mpath href={`#ep-${s.edgeId}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}

      {/* Nodes */}
      {LAYERS.map((layer, li) =>
        layer.nodes.map(n => {
          const nd = n as any;
          const isAgent = !!nd.agentId;
          const isActive = nd.agentId === activeAgentId;
          const r = isAgent ? 14 : 9;

          return (
            <g key={n.id}>
              {/* Outer pulse ring for active agent */}
              {isActive && (
                <>
                  <circle cx={layer.x} cy={n.y} r={r + 8} fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.12} strokeWidth="0.5">
                    <animate attributeName="r" values={`${r+6};${r+14};${r+6}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.12;0.03;0.12" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={layer.x} cy={n.y} r={r + 3} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth="0.6">
                    <animate attributeName="r" values={`${r+2};${r+6};${r+2}`} dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Node body */}
              <rect
                x={layer.x - r} y={n.y - r}
                width={r * 2} height={r * 2}
                rx={isAgent ? 5 : 3}
                fill="currentColor"
                fillOpacity={isActive ? 0.92 : isAgent ? 0.5 : 0.22}
                filter={isAgent ? "url(#ng)" : undefined}
                style={{ transition: "fill-opacity 0.5s" }}
              />

              {/* Label */}
              {nd.label && (
                <text
                  x={layer.x} y={n.y + r + 11}
                  textAnchor="middle"
                  fontSize={isAgent ? "9" : "7"}
                  fill="currentColor"
                  fillOpacity={isActive ? 0.9 : 0.4}
                  fontFamily="system-ui"
                  fontWeight={isActive ? "700" : "400"}
                  style={{ transition: "fill-opacity 0.5s" }}
                >
                  {nd.label}
                </text>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [activeQ, setActiveQ] = useState<{ q: string; a: string } | null>(null);
  const { out, done } = useTypewriter(activeQ?.a ?? "");

  const handleQ = (agentId: string, item: { q: string; a: string }) => {
    setActiveAgentId(agentId);
    setActiveQ(item);
  };

  return (
    <div className="min-h-screen pb-32 bg-background">
      <div className="max-w-4xl mx-auto px-6 pt-16 sm:pt-24">

        <BlurFade delay={0.04}>
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60 mb-3 font-medium">Neural Agent Network</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">Ask About Me</h1>
            <p className="text-xs text-muted-foreground/60 mt-3 tracking-wide">select a question — watch the network activate</p>
          </div>
        </BlurFade>

        {/* Network */}
        <BlurFade delay={0.08}>
          <div className="mb-12">
            <NetworkSVG activeAgentId={activeAgentId} />
          </div>
        </BlurFade>

        {/* Questions */}
        <BlurFade delay={0.12}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            {Object.entries(AGENTS).map(([id, agent]) => (
              <div key={id}>
                <p className="text-[9px] tracking-[0.22em] uppercase text-muted-foreground/60 mb-3 font-semibold">{agent.label} Agent</p>
                <div className="flex flex-col gap-1.5">
                  {agent.qa.map(item => {
                    const isActive = activeAgentId === id && activeQ?.q === item.q;
                    return (
                      <button
                        key={item.q}
                        onClick={() => handleQ(id, item)}
                        className={cn(
                          "text-left text-[11px] leading-snug px-3 py-2 rounded-lg border transition-all duration-300",
                          isActive
                            ? "border-foreground/20 bg-foreground/8 text-foreground"
                            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted"
                        )}
                      >
                        {item.q}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </BlurFade>

        {/* Answer */}
        {activeQ && (
          <BlurFade delay={0} key={activeQ.q}>
            <div className="rounded-2xl border border-border bg-card px-7 py-6">
              <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground/60 mb-4 font-semibold">
                {AGENTS[activeAgentId!]?.label} · response
              </p>
              <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/80 font-light">
                {out}
                {!done && (
                  <span className="inline-block w-[2px] h-[13px] bg-foreground/50 align-middle ml-0.5 animate-pulse" />
                )}
              </p>
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  );
}
