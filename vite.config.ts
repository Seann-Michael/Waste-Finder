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
          // Vendor chunk for large libraries
          vendor: ["react", "react-dom", "react-router-dom"],

          // UI components chunk
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-dropdown-menu",
            "lucide-react",
          ],

          // Form handling chunk
          forms: ["react-hook-form", "@hookform/resolvers"],

          // Query and state management
          query: ["@tanstack/react-query"],

          // Monitoring and analytics
          monitoring: ["@sentry/react", "web-vitals"],

          // Utilities
          utils: ["clsx", "tailwind-merge", "date-fns"],

          // Admin pages (separate chunk for admin-only code)
          admin: [
            "./client/pages/admin/AddLocation.tsx",
            "./client/pages/admin/AdminSettings.tsx",
            "./client/pages/admin/LocationDataTable.tsx",
            "./client/pages/admin/Marketing.tsx",
            "./client/pages/admin/BlogAdmin.tsx",
          ],
        },
      },
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "react-hook-form",
        "lucide-react",
      ],
      exclude: [
        // Exclude unused heavy dependencies
        "three",
        "@react-three/fiber",
        "@react-three/drei",
      ],
    },

    // Performance optimizations
    minify: mode === "production" ? "terser" : false,
    terserOptions:
      mode === "production"
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          }
        : {},

    // Source map for debugging in development
    sourcemap: mode === "development",

    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },

  plugins: [
    react({
      // Enable development optimizations
      tsDecorators: true,
    }),
    expressPlugin(),
    // Only enable Sentry plugin in production builds
    mode === "production" && process.env.SENTRY_AUTH_TOKEN
      ? sentryVitePlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
        })
      : null,
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
