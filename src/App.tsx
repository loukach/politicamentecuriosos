import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { usePostHog } from "posthog-js/react";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";

function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture("$pageview", { $current_url: window.location.href });
  }, [location, posthog]);

  return null;
}

const App = () => (
  <BrowserRouter>
    <PostHogPageView />
    <Navbar />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<PostDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
