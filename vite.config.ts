import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ["react", "react-dom", "react-router-dom"],

          // UI components (simplified)
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "lucide-react",
          ],

          // Admin pages (lazy loaded)
          admin: [
            "./client/pages/admin/AdminSettings.tsx",
            "./client/pages/admin/LocationDataTable.tsx",
          ],
        },
      },
    },

    // Fast minification for Netlify
    minify: mode === "production" ? "esbuild" : false,

    // No source maps in production for faster builds
    sourcemap: false,

    // Increase chunk size limit to reduce chunks
    chunkSizeWarningLimit: 1000,

    // Target modern browsers for smaller bundles
    target: "esnext",
  },

  plugins: [
    react({
      // Optimize for production builds
      tsDecorators: true,
    }),
    expressPlugin(),
    // Disable Sentry for faster builds - can be re-enabled later if needed
    // mode === "production" && process.env.SENTRY_AUTH_TOKEN
    //   ? sentryVitePlugin({
    //       org: process.env.SENTRY_ORG,
    //       project: process.env.SENTRY_PROJECT,
    //       authToken: process.env.SENTRY_AUTH_TOKEN,
    //     })
    //   : null,
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },

  // CSS optimization
  css: {
    devSourcemap: mode === "development",
  },

  // Enable experimental features for better performance
  esbuild: {
    target: "esnext",
    format: "esm",
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
