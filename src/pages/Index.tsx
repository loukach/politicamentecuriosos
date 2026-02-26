import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Mail, CheckCircle } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import PostCard from "@/components/PostCard";
import { getProjects, getPublishedPosts } from "@/data";

const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORM_ID";

export default function Index() {
  const projects = getProjects();
  const posts = getPublishedPosts(3);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Erro ao subscrever.");
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Erro ao subscrever.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--civic-violet)/0.1),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--civic-teal)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-24 md:py-36 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Coletivo de Educação Cívica
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Cidadãos informados,{" "}
              <span className="bg-gradient-to-r from-primary via-civic-coral to-accent bg-clip-text text-transparent">
                democracia mais forte
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl">
              <span className="font-bold text-foreground">#politicamentecuriosos</span> é um coletivo de produtos criados para promover uma democracia saudável em que os cidadãos acompanham e participam no processo legislativo. Explora o nosso trabalho e mantém-te atualizado.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button size="lg" asChild className="rounded-full">
                <Link to="/projects">Explorar Projetos <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full">
                <Link to="/blog">Ler Atualizações</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Mantém-te informado</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Deixa o teu email para receberes novidades sobre os nossos projetos.
          </p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-primary font-medium py-3">
              <CheckCircle className="h-5 w-5" />
              Obrigado! Vamos manter-te atualizado.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="O teu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "A enviar..." : "Subscrever"}
              </Button>
            </form>
          )}
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold">Os Nossos Projetos</h2>
              <p className="text-muted-foreground mt-1">Iniciativas independentes que fazem a diferença</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/projects">Ver todos <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold">Últimas Atualizações</h2>
                <p className="text-muted-foreground mt-1">Notícias e histórias dos nossos projetos</p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link to="/blog">Ver todos <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-display font-semibold text-foreground mb-1">#politicamentecuriosos</p>
          <p>Um coletivo de projetos independentes de educação cívica.</p>
        </div>
      </footer>
    </main>
  );
}
