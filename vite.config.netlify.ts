import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Minimal Vite configuration for Netlify builds
export default defineConfig({
  plugins: [
    react({
      // Minimal React plugin config
      tsDecorators: true,
    }),
  ],

  build: {
    outDir: "dist/spa",

    // Fast build settings
    minify: "esbuild", // Fastest minifier
    sourcemap: false, // No source maps for speed
    target: "esnext", // Modern browsers only

    // Simple chunk strategy
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },

    // Increase limits to avoid warnings
    chunkSizeWarningLimit: 2000,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },

  // Minimal CSS config
  css: {
    devSourcemap: false,
  },

  // Fast esbuild settings
  esbuild: {
    target: "esnext",
    format: "esm",
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },

  // Disable server-related configs for build
  server: undefined,
});
