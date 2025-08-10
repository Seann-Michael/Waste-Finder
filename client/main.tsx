import "./global.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeSampleArticles } from "@/lib/sampleArticles";

// Initialize sample articles for demonstration
initializeSampleArticles();

// Improved HMR setup to prevent client errors
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

// Create root instance with better HMR handling
let root = (window as any).__react_root;

if (!root) {
  root = createRoot(container);
  (window as any).__react_root = root;
}

// Minimal HMR handling to prevent client errors
if (import.meta.hot) {
  import.meta.hot.accept();
}

// Render with error boundary
try {
  root.render(<App />);
} catch (error) {
  console.error("App render error:", error);
}
