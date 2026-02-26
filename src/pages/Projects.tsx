import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/data";

export default function Projects() {
  const projects = getProjects();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold">Todos os Projetos</h1>
        <p className="text-muted-foreground mt-2">Descubra iniciativas de educação cívica com impacto</p>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-20">Ainda não existem projetos. Volte em breve!</p>
      )}
    </main>
  );
}
