import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import type { PostWithProject } from "@/data/types";

export default function PostCard({ post }: { post: PostWithProject }) {
  return (
    <Link to={`/blog/${post.id}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
        )}
        <CardContent className="p-5">
          {post.project && (
            <Badge variant="secondary" className="mb-2 text-xs bg-primary/10 text-primary border-0">
              {post.project.name}
            </Badge>
          )}
          <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
          )}
          {post.published_at && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
              <Calendar className="h-3 w-3" />
              {format(new Date(post.published_at), "d 'de' MMM, yyyy", { locale: pt })}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
