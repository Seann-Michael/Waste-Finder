import "./global.css";
import { createRoot } from "react-dom/client";
import React from "react";

const TestApp = () => {
  try {
    // Try to import App component
    const App = React.lazy(() => import("./App"));
    return (
      <React.Suspense fallback={<div>Loading app components...</div>}>
        <App />
      </React.Suspense>
    );
  } catch (error) {
    console.error("Error loading App:", error);
    return <div>Error loading app: {String(error)}</div>;
  }
};

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);

try {
  root.render(<TestApp />);
} catch (error) {
  console.error("Render error:", error);
  root.render(<div>Render error: {String(error)}</div>);
}
