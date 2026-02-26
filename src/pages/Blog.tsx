import PostCard from "@/components/PostCard";
import { getPublishedPosts } from "@/data";

export default function Blog() {
  const posts = getPublishedPosts();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold">Blog & Atualizações</h1>
        <p className="text-muted-foreground mt-2">Últimas notícias de todos os projetos</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-20">Ainda não existem artigos. Volte em breve!</p>
      )}
    </main>
  );
}
