import { ExternalLink, Github, Gitlab, Mail } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/data/types";

const URL_RE = /(https?:\/\/[^\s]+)/;

// Description without URL-bearing lines — a clean blurb for the card body.
function cardBlurb(desc: string | null): string {
  if (!desc) return "";
  return desc
    .split("\n")
    .filter((line) => !line.includes("http"))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Pull "URL — label" entries out of the description so they render as real links.
// Used for projects that expose several destinations (Política Factual's two
// Instagram accounts, Voto Aberto's site + API + terminal).
function extractLinks(desc: string | null): { url: string; label: string }[] {
  if (!desc) return [];
  return desc
    .split("\n")
    .map((line) => {
      const m = line.match(URL_RE);
      if (!m) return null;
      const url = m[1];
      const label = line.replace(url, "").replace(/^\s*[—–-]\s*/, "").trim();
      return { url, label: label || url.replace(/^https?:\/\//, "") };
    })
    .filter((x): x is { url: string; label: string } => x !== null);
}

export default function ProjectCard({ project }: { project: Project }) {
  const posthog = usePostHog();
  const blurb = cardBlurb(project.description);
  const track = (url: string) =>
    posthog?.capture("project_visit", { project: project.name, url });

  // Every destination the project exposes. Projects that list several links in
  // their description (Política Factual, Voto Aberto) show them all; the rest
  // get a single "Visitar site" pointing at website_url.
  const descLinks = extractLinks(project.description);
  const siteLinks =
    descLinks.length > 0
      ? descLinks
      : project.website_url
      ? [{ url: project.website_url, label: "Visitar site" }]
      : [];

  const RepoIcon = project.repo_url?.includes("gitlab") ? Gitlab : Github;

  const hasFooter =
    siteLinks.length > 0 || !!project.repo_url || !!project.contact_email;

  return (
    <Card className="group h-full flex flex-col overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
      {project.screenshot_url ? (
        <img
          src={project.screenshot_url}
          alt={`Página inicial de ${project.name}`}
          className="w-full h-40 sm:h-56 md:h-64 object-cover object-top"
        />
      ) : (
        <div className="w-full h-40 sm:h-56 md:h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
      )}
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-4">
          {project.logo_url ? (
            <img
              src={project.logo_url}
              alt={`${project.name} logo`}
              className="w-14 h-14 rounded-xl object-cover shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-primary font-display">
                {project.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-lg">{project.name}</h3>
            {blurb && (
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line line-clamp-5">
                {blurb}
              </p>
            )}
          </div>
        </div>

        {hasFooter && (
          <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-2">
            {siteLinks.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(l.url)}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{l.label}</span>
              </a>
            ))}

            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(project.repo_url!)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <RepoIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Código-fonte</span>
              </a>
            )}

            {project.contact_email && (
              <a
                href={`mailto:${project.contact_email}`}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{project.contact_email}</span>
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
