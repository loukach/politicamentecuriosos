import { useParams, Link } from "react-router-dom";
import { getProject, getProjectPosts } from "@/data";
import PostCard from "@/components/PostCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Mail, Users } from "lucide-react";

const tagColors = [
  "bg-civic-coral/15 text-civic-coral",
  "bg-civic-teal/15 text-civic-teal",
  "bg-civic-violet/15 text-civic-violet",
  "bg-civic-amber/15 text-civic-amber",
  "bg-civic-sky/15 text-civic-sky",
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProject(id) : undefined;
  const posts = id ? getProjectPosts(id) : [];

  if (!project) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-muted-foreground">Projeto não encontrado.</p>
      <Button variant="ghost" asChild className="mt-4"><Link to="/projects"><ArrowLeft className="mr-1 h-4 w-4" /> Voltar</Link></Button>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/projects"><ArrowLeft className="mr-1 h-4 w-4" /> Todos os Projetos</Link>
      </Button>

      <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-primary via-secondary to-accent" />
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {project.logo_url ? (
              <img src={project.logo_url} alt={project.name} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary font-display">{project.name.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-bold">{project.name}</h1>
              {project.description && <p className="text-muted-foreground mt-3 text-lg whitespace-pre-line">{project.description}</p>}

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag, i) => (
                    <Badge key={tag} variant="outline" className={`${tagColors[i % tagColors.length]} border-0`}>{tag}</Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
                {project.website_url && (
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <ExternalLink className="h-4 w-4" /> Website
                  </a>
                )}
                {project.contact_email && (
                  <a href={`mailto:${project.contact_email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" /> {project.contact_email}
                  </a>
                )}
                {project.team_info && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {project.team_info}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Posts */}
      {posts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold mb-6">Atualizações de {project.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
