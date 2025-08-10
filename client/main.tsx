import "./global.css";
import { createRoot } from "react-dom/client";
import React from "react";

const TestApp = () => {
  return <div>App is loading...</div>;
};

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);
root.render(<TestApp />);
