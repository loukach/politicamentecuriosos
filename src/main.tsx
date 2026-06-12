import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import App from "./App.tsx";
import "./index.css";

posthog.init(
  import.meta.env.VITE_POSTHOG_KEY ?? "phc_sKKWjAGRaZaejNggRphihrHKVstvBQzWCuLuCRSsqjqi",
  {
    api_host: import.meta.env.VITE_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    capture_pageview: false, // handled manually on route change
    capture_pageleave: true,
    autocapture: true,
  }
);

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
);
