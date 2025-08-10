import "./global.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeSampleArticles } from "@/lib/sampleArticles";

// Initialize sample articles for demonstration
initializeSampleArticles();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);
root.render(<App />);
