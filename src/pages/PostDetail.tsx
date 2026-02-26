import { useParams, Link } from "react-router-dom";
import { getPost } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post = id ? getPost(id) : undefined;

  if (!post) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-muted-foreground">Artigo não encontrado.</p>
      <Button variant="ghost" asChild className="mt-4"><Link to="/blog"><ArrowLeft className="mr-1 h-4 w-4" /> Voltar</Link></Button>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/blog"><ArrowLeft className="mr-1 h-4 w-4" /> Todos os Artigos</Link>
      </Button>

      {post.cover_image_url && (
        <img src={post.cover_image_url} alt={post.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" />
      )}

      {post.project && (
        <Link to={`/projects/${post.project.id}`}>
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0 hover:bg-primary/20 transition-colors">
            {post.project.name}
          </Badge>
        </Link>
      )}

      <h1 className="font-display text-3xl md:text-4xl font-bold">{post.title}</h1>

      {post.published_at && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
          <Calendar className="h-4 w-4" />
          {format(new Date(post.published_at), "d 'de' MMM, yyyy", { locale: pt })}
        </div>
      )}

      {post.content && (
        <article
          className="tiptap mt-8 prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </main>
  );
}
