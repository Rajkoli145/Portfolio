# Raj Koli — Developer Portfolio & Research Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

Personal portfolio, interactive engineering hub, and automated publishing platform built by **Raj Koli**. AI engineer focused on LLM applications, agent evaluation, developer tooling, and research monographs.

🌐 **Live Website:** [rajkoli.vercel.app](https://rajkoli.vercel.app)

---

## 💡 Key Features

### 📚 MDX Handbook Library
Handbook content is stored in `content/book` and compiled by Content Collections during development and builds:
- **Software Engineering & Product Development Handbook**: 15 chapters from problem discovery through production engineering, including an evidence-bounded AgentBench case study.
- **Startup Research Handbook**: 13 chapters on researching problems, customer needs, and market gaps.

Each handbook has an independent table of contents, direct chapter URLs, and previous/next navigation at `/book`.

### 🎨 Custom Design System & Themes
- **Interactive Dock Navigation**: macOS-style bottom dock with smooth hover effects, tooltips, and responsive layout.
- **Dynamic Accent Color Picker**: Instant theme customizer (Blue, Purple, Green, Orange, Pink, Black) backed by Zustand persistence.
- **Dark/Light Mode**: Seamless system & manual theme toggling via `next-themes`.

### 🛡️ Access Control & Security
- **Research Access Gate**: Secret passcode modal verification and IP check API for gated research handbooks.
- **Edge Runtime Verification**: Edge-compatible API routes ensuring fast validation.

### 🛠️ Open-Source & Project Showcase
- **Engineering Projects**: Interactive project cards detailing architecture, tech stack, and live GitHub repositories (*FreelancerFlow*, *EduStory*).
- **Open-Source Contributions**: Contribution logs for projects like *RustChain Installer*, *La Tanda SDK*, and *Hiero SDK Python*.

### 🎵 Entertainment & Personal Hub
- **Spotify Integration**: Embedded player featuring current listening vibes and curated playlists.
- **Movie Watchlist**: Dynamic cards powered by TMDB API displaying favorite films and series.
- **Notes & Command Palette**: Built-in developer notes widget and quick search palette (`Cmd + K`).

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Magic UI, Lucide Icons, Radix UI |
| **State Management** | Zustand (with LocalStorage persistence) |
| **Content Processing** | `@content-collections/core`, `@content-collections/mdx`, Remark GFM, Shiki |
| **Icons & Media** | Lucide React, Radix Icons, TMDB API, Spotify Embeds |
| **Build Pipeline** | Next.js build with Content Collections MDX compilation |
| **Deployment** | Vercel CI/CD |

---

## 📁 Repository Structure

```
├── content/book/                # Startup Research Handbook chapters
│   └── software-engineering/     # Software Engineering handbook chapters
├── research/entries/            # Research logs with metadata and optional notes
├── src/
│   ├── app/                     # Next.js App Router pages & API routes
│   │   ├── book/                # Handbooks overview & MDX reader routes
│   │   ├── github/              # Engineering journey & contribution stats
│   │   ├── research/            # Research log, article reader, and local editor
│   │   ├── spotify/             # Music player interface
│   │   ├── netflix/             # Movie watchlist section
│   │   └── api/                 # Access verification & contact endpoints
│   ├── components/              # UI components, MagicUI animations, Dock, Nav
│   ├── data/                    # Resume, project, and notes data sources
│   ├── store/                   # Zustand settings & theme state
│   └── lib/                     # Utilities & custom Markdown plugins
├── content-collections.ts       # MDX collection definitions
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.9.0 or higher (Node.js 22 recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajkoli145/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Content Collections compiles the local MDX chapters and research entries as part of the build.

---


## Local Research Editor

Set `EDITOR_PASSWORD` to a strong password in your untracked `.env.local`, then restart `npm run dev` and open `/research/editor`. There is no default password. The editor and its write/publish APIs are available only in development mode. Authentication uses a signed, HTTP-only session cookie that expires after 12 hours; changing the password invalidates existing sessions.

Entries support Markdown notes separately from the article body. Autosave and manual save preserve these notes and the original creation date. The **Publish** action sets the selected entry to published, commits only its file, and pushes the current branch using your local Git credentials. Review your entry and branch before confirming publication. A failed push is reported separately from a failed commit.

Verification commands:

```bash
npm run lint
npx tsc --noEmit
node --test tests/research-editor.test.mjs
# With the development server running:
node --test tests/handbooks.test.mjs
npm run build
```

Research-editor tests use temporary files and a fake Git executor; they never commit or push.

---

## 🤝 Connect & Socials

- **GitHub:** [@Rajkoli145](https://github.com/Rajkoli145)
- **LinkedIn:** [Raj Koli](https://linkedin.com/in/raj-koli-626008318)
- **Email:** [koliraj911@gmail.com](mailto:koliraj911@gmail.com)

---

*Designed and engineered by Raj Koli © 2026*
