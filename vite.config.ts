import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // componentTagger removido — causa problemas em alguns ambientes
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Gera _redirects compatível com Netlify/Vercel via plugin abaixo
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["framer-motion", "lucide-react"],
          animation: ["gsap", "@studio-freight/lenis"],
          supabase: ["@supabase/supabase-js"],
          state: ["zustand", "zod", "@tanstack/react-query"],
        },
      },
    },
  },
}));
