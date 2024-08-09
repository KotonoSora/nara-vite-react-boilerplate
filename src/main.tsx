import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";
import forceUpgradeLatestVersion from "@/utils/forceUpgradeLatestVersion";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  forceUpgradeLatestVersion();
}
