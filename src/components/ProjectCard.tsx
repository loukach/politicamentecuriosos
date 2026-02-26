import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/data/types";

const tagColors = [
  "bg-civic-coral/15 text-civic-coral",
  "bg-civic-teal/15 text-civic-teal",
  "bg-civic-violet/15 text-civic-violet",
  "bg-civic-amber/15 text-civic-amber",
  "bg-civic-sky/15 text-civic-sky",
];

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
        <CardContent className="p-6">
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
              <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors truncate">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.tags.map((tag, i) => (
                <Badge key={tag} variant="outline" className={`${tagColors[i % tagColors.length]} border-0 text-xs`}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {project.website_url && (
            <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">{project.website_url.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
