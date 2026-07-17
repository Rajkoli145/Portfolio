"use client";

import { motion } from "motion/react";
import { CheckCircle2, GitCommit, Rocket, Database, Lock, Cpu, Globe } from "lucide-react";

const journeySteps = [
    {
        title: "Building Founder Agent",
        description: "Conceptualized and began architecture for an autonomous AI founder agent.",
        icon: <Rocket className="w-5 h-5 text-blue-500" />,
        date: "Phase 1"
    },
    {
        title: "Created Authentication System",
        description: "Implemented secure JWT-based auth with NextAuth and persistent sessions.",
        icon: <Lock className="w-5 h-5 text-green-500" />,
        date: "Phase 2"
    },
    {
        title: "Designed Database",
        description: "Structured MongoDB schemas and optimized aggregation pipelines.",
        icon: <Database className="w-5 h-5 text-purple-500" />,
        date: "Phase 3"
    },
    {
        title: "Implemented AI Features",
        description: "Integrated OpenAI API for dynamic prompt generation and validation.",
        icon: <Cpu className="w-5 h-5 text-amber-500" />,
        date: "Phase 4"
    },
    {
        title: "Released Version 1.0",
        description: "Shipped MVP to production on Vercel with full CI/CD pipeline.",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        date: "Phase 5"
    },
    {
        title: "Open Source Contributions",
        description: "Began contributing back to the ecosystem via bounties and PRs.",
        icon: <Globe className="w-5 h-5 text-indigo-500" />,
        date: "Ongoing"
    },
    {
        title: "Latest Experiments",
        description: "Currently exploring Web3 integrations and terminal benchmarking.",
        icon: <GitCommit className="w-5 h-5 text-pink-500" />,
        date: "Present"
    }
];

export function EngineeringJourney() {
    return (
        <section id="timeline" className="flex flex-col gap-12 py-12">
            <div className="flex flex-col gap-4 text-center items-center">
                <h2 className="text-3xl font-bold tracking-tight">Engineering Journey</h2>
                <p className="text-muted-foreground max-w-xl">
                    Every repository represents a learning milestone. Here is the story of my core development focus over time.
                </p>
            </div>

            <div className="relative max-w-3xl mx-auto w-full">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

                <div className="flex flex-col gap-12 relative z-10">
                    {journeySteps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`flex flex-col md:flex-row items-start md:items-center gap-6 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                        >
                            {/* Content Side */}
                            <div className={`flex-1 flex flex-col gap-2 w-full pl-12 md:pl-0 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{step.date}</span>
                                <h3 className="text-lg font-semibold">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>

                            {/* Node */}
                            <div className="absolute left-4 md:relative md:left-auto flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border shadow-sm -translate-x-1/2 md:translate-x-0 z-10">
                                {step.icon}
                            </div>

                            {/* Empty Space for alignment */}
                            <div className="hidden md:block flex-1" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
