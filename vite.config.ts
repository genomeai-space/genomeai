import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multi-asset build (no singlefile) — smaller HTML, cacheable JS/CSS chunks.
// Absolute base "/" keeps shells under /pricing/index.html loading /assets/* correctly.
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("/react/")) {
              return "react-vendor";
            }
            // @supabase is dynamically imported → its own async chunk
            return "vendor";
          }
          // Keep dashboard off the critical landing path
          if (id.includes("/components/dashboard/")) {
            return "dashboard";
          }
        },
      },
    },
  },
});
