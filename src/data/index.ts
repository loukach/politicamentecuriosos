import type { Project, Post, PostWithProject } from "./types";
import projectsData from "./projects.json";
import postsData from "./posts.json";

const base = import.meta.env.BASE_URL;

function resolveUrl(url: string | null): string | null {
  if (!url || url.startsWith("http")) return url;
  return base + url;
}

const projects: Project[] = projectsData.map((p) => ({
  ...p,
  logo_url: resolveUrl(p.logo_url),
}));
const posts: Post[] = postsData.map((p) => ({
  ...p,
  cover_image_url: resolveUrl(p.cover_image_url),
}));

export function getProjects(): Project[] {
  return [...projects].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getPublishedPosts(limit?: number): PostWithProject[] {
  const published = posts
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.published_at ?? b.created_at).getTime() -
        new Date(a.published_at ?? a.created_at).getTime()
    )
    .map((post) => ({
      ...post,
      project: projects.find((p) => p.id === post.project_id) ?? null,
    }));
  return limit ? published.slice(0, limit) : published;
}

export function getProjectPosts(projectId: string): PostWithProject[] {
  return posts
    .filter((p) => p.project_id === projectId && p.published)
    .sort(
      (a, b) =>
        new Date(b.published_at ?? b.created_at).getTime() -
        new Date(a.published_at ?? a.created_at).getTime()
    )
    .map((post) => ({
      ...post,
      project: projects.find((p) => p.id === post.project_id) ?? null,
    }));
}

export function getPost(id: string): PostWithProject | undefined {
  const post = posts.find((p) => p.id === id);
  if (!post) return undefined;
  return {
    ...post,
    project: projects.find((p) => p.id === post.project_id) ?? null,
  };
}
