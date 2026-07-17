import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { DATA } from "@/data/resume";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function GitHubPage() {
  const username = DATA.contact.social.GitHub.url.split("/").pop() || "Rajkoli145";
  
  // Fetch data on the server with Next.js caching
  const [profileRes, reposRes, readmeRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { next: { revalidate: 3600 } }),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { next: { revalidate: 3600 } }),
    fetch(`https://raw.githubusercontent.com/${username}/${username}/main/README.md`, { next: { revalidate: 3600 } })
  ]);

  const profile = profileRes.ok ? await profileRes.json() : null;
  const repos = reposRes.ok ? await reposRes.json() : [];
  const readme = readmeRes.ok ? await readmeRes.text() : "";

  if (!profile) {
    return <div className="text-center mt-20 text-destructive">Failed to load GitHub profile.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background">
      <div className="w-[95%] max-w-[1600px] mx-auto p-6 md:p-10 flex flex-col gap-10">
        
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-border shadow-sm"
          />
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold">
              {profile.name || username}
            </h2>
            <p className="text-muted-foreground text-lg">
              {profile.bio}
            </p>
            <div className="flex gap-4 text-sm mt-2">
              <span className="text-muted-foreground flex items-center gap-1">
                <strong className="text-foreground">
                  {profile.followers}
                </strong>{" "}
                followers
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <strong className="text-foreground">
                  {profile.public_repos}
                </strong>{" "}
                repositories
              </span>
            </div>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-500 hover:underline mt-1 w-fit"
            >
              View on GitHub ↗
            </a>
          </div>
        </div>

        {/* Repositories */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold border-b pb-2">
            Recent Repositories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map((repo: any) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-2 p-5 border rounded-xl hover:bg-muted/50 transition-colors shadow-sm"
              >
                <h4 className="font-semibold text-blue-500 text-lg">
                  {repo.name}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {repo.description || "No description provided."}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-4">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    ⭐ {repo.stargazers_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Readme */}
        {readme && (
          <div className="flex flex-col gap-4 pt-4">
            <h3 className="text-xl font-semibold border-b pb-2">
              {username}/README.md
            </h3>
            <div className="prose prose-neutral dark:prose-invert max-w-none w-full overflow-hidden mt-4">
              <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{readme}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
