import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon, Clapperboard, Settings } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";

export const DATA = {
  name: "Raj Koli",
  initials: "RK",
  url: "https://rajkoli.vercel.app",
  location: "India",
  locationLink: "https://www.google.com/maps/place/India",
  description:
    "Full stack developer who enjoys building systems that actually work under pressure.",
  summary:
    "Full stack developer who enjoys building systems that actually work under pressure — REST APIs, Linux automation, CLI tooling, and backend pipelines. Recently got into AI model benchmarking and terminal bench task design, building hard CLI tasks for tools like T-Bench and Harbor that test real agent capability gaps. Comfortable jumping into unfamiliar codebases and shipping quickly.",
  avatarUrl: "/me.png",
  spotifyPlaylistUrl: "https://open.spotify.com/playlist/77SfoFRDHeoiRXeOxWYMBZ",
  movies: [
    {
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      tags: ["Sci-Fi", "Action", "Mind-Bending"],
      link: "https://www.netflix.com"
    },
    {
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      tags: ["Sci-Fi", "Drama", "Space"],
      link: "https://www.netflix.com"
    },
    {
      title: "The Matrix",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      imageUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      tags: ["Sci-Fi", "Action", "Cyberpunk"],
      link: "https://www.netflix.com"
    },
    {
      title: "Spider-Man: Across the Spider-Verse",
      description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
      imageUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      tags: ["Animation", "Action", "Masterpiece"],
      link: "https://www.netflix.com"
    }
  ],
  skills: [
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Typescript", icon: Typescript },
    { name: "JavaScript", icon: Typescript },
    { name: "Node.js", icon: Nodejs },
    { name: "Python", icon: Python },
    { name: "MongoDB", icon: Postgresql },
    { name: "Docker", icon: Docker },
    { name: "Bash/Shell", icon: Docker },
    { name: "Tailwind CSS", icon: ReactLight },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/book", icon: NotebookIcon, label: "Book" },
    { href: "/spotify", icon: Icons.spotify, label: "Spotify" },
    { href: "/netflix", icon: Icons.netflix, label: "Movies" },
    { href: "/github", icon: Icons.github, label: "GitHub" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ],
  contact: {
    email: "koliraj911@gmail.com",
    tel: "+91 9619564351",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Rajkoli145",
        icon: Icons.github,
        navbar: false,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/raj-koli-626008318",
        icon: Icons.linkedin,
        navbar: true,
      },
      Discord: {
        name: "Discord",
        url: "https://discordapp.com/users/1368817799052525614",
        icon: Icons.x,
        navbar: false,
      },
      Youtube: {
        name: "Youtube",
        url: "#",
        icon: Icons.youtube,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "/contact",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Unified Mentor",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Frontend Developer Intern",
      logoUrl: "/unifiedmentor.png",
      start: "Sep 2024",
      end: "Dec 2024",
      description:
        "Refactored UI into modular, reusable React components adopted across the entire codebase. Reviewed and merged pull requests per sprint, maintaining code quality standards across the team. Shipped iterative product features across a 4-month engagement, consistently meeting sprint deadlines.",
    },
    {
      company: "RustChain",
      href: "#",
      badges: ["Open Source"],
      location: "Remote",
      title: "Installer Contributor",
      logoUrl: "/rustchain.png",
      start: "2026",
      end: "2026",
      description:
        "Cut blockchain node setup time by building a cross-platform CLI installer for macOS and Linux that fully automated wallet configuration, file I/O, and service registration end-to-end. Implemented SHA-256 checksum validation and systemd/launchd service automation; PR merged into main repository and awarded a project bounty on first submission.",
    },
    {
      company: "La Tanda",
      href: "#",
      badges: ["Fintech"],
      location: "Remote",
      title: "SDK Developer",
      logoUrl: "/la_tanda.png",
      start: "2025",
      end: "2025",
      description:
        "Built a production TypeScript SDK with a modular HttpClient and centralized error handling, covering the full API surface. Eliminated an entire class of integration bugs by validating all endpoints against Swagger documentation before release.",
    },
    {
      company: "Hiero SDK",
      href: "#",
      badges: ["Open Source"],
      location: "Remote",
      title: "Python Contributor",
      logoUrl: "/hiero.png",
      start: "2026",
      end: "2026",
      description:
        "Contributed to the official v0.2.2 release by fixing CI/CD dependency resolution — ensuring uv run uses lowest-direct resolution in the deps-check workflow, preventing lockfile mismatches across environments. PR reviewed, merged, and shipped in an official changelog; collaborated asynchronously with 20+ open source contributors across a global community using GitHub Actions and branch-based workflows.",
    }
  ],
  education: [
    {
      school: "ITM Skills University",
      href: "https://isu.ac.in/btech-cse/",
      degree: "BTech in Computer Science",
      logoUrl: "/itm.png",
      start: "Aug 2024",
      end: "2028",
    },
    {
      school: "12th Grade (PCMB)",
      href: "https://www.stxaviersnerul.com/",
      degree: "Higher Secondary Certificate (HSC)",
      logoUrl: "/st.xaviers.png",
      start: "2024",
      end: "2024",
    },
  ],
  projects: [
    {
      title: "FreelancerFlow",
      href: "https://github.com/Rajkoli145/freelancerflow",
      dates: "May 13, 2026 - Live",
      active: true,
      description:
        "Built a complete full-stack platform from scratch handling project tracking, invoicing, and client management for freelancers. Reduced invoice generation time by designing a structured file I/O export pipeline. Secured all API routes with JWT authentication and middleware validation. Wrote automated endpoint tests covering all critical API routes.",
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Tailwind CSS",
        "JWT"
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/Rajkoli145/freelancerflow",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/freelancerflow.png",
      video: "",
    },
    {
      title: "EduStory",
      href: "https://github.com/Rajkoli145/edustory",
      dates: "May 13, 2026 - Live",
      active: true,
      description:
        "Built an end-to-end AI storytelling platform delivering dynamic, personalised story generation. Designed a prompt pipeline architecture that reduced AI output inconsistency by structuring inputs and validating outputs programmatically. Implemented NextAuth with persistent sessions and role-based access. Wrote validation scripts to automatically test AI-generated content quality.",
      technologies: [
        "Next.js",
        "MongoDB",
        "OpenAI API",
        "NextAuth"
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/Rajkoli145/edustory",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/edustory.png",
      video: "",
    },
    {
      title: "macOS Portfolio",
      href: "https://rajkoli.vercel.app",
      dates: "Dec 26, 2025 - Live",
      active: true,
      description:
        "Built a fully interactive macOS-style personal portfolio running in the browser — complete with a working dock, draggable windows, and project showcases, deployed via Vercel.",
      technologies: [
        "JavaScript",
        "HTML",
        "CSS"
      ],
      links: [
        {
          type: "Website",
          href: "https://rajkoli.vercel.app",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/macos.png",
      video: "",
    },
    {
      title: "DealVault Escrow",
      href: "https://github.com/DealVaultHQ/dealvault-platform-escrow",
      dates: "Feb 15, 2026 - Present",
      active: true,
      description: "Modern escrow web application for secure buyer-seller transactions. Building a robust platform to handle transaction states and verifiable escrow logic.",
      technologies: ["TypeScript", "Next.js", "Tailwind CSS"],
      links: [
        {
          type: "Source",
          href: "https://github.com/DealVaultHQ/dealvault-platform-escrow",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/dealvault.png",
      video: "",
    },
    {
      title: "Almost Friday",
      href: "https://github.com/Soldier224K/ALMOST_FRIDAY",
      dates: "May 25, 2026 - Present",
      active: true,
      description: "An ongoing collaborative software project focusing on modern web infrastructure and dynamic user experiences.",
      technologies: ["React", "TypeScript", "Node.js"],
      links: [
        {
          type: "Source",
          href: "https://github.com/Soldier224K/ALMOST_FRIDAY",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/almost_friday.png",
      video: "",
    },
    {
      title: "AI Founder Intelligence",
      href: "https://github.com/Rajkoli145/ai-founder-intelligence",
      dates: "May 25, 2026 - Present",
      active: true,
      description: "An AI-powered intelligence platform tailored for startup founders, providing data-driven market insights and strategic AI playbooks.",
      technologies: ["Next.js", "OpenAI", "Python"],
      links: [
        {
          type: "Source",
          href: "https://github.com/Rajkoli145/ai-founder-intelligence",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/ai_founder.png",
      video: "",
    }
  ],
  hackathons: [] as {
    title: string;
    dates: string;
    location: string;
    description: string;
    image: string;
    links: { title: string; icon: any; href: string }[];
  }[]
} as const;
