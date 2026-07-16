import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyTheme } from "./lib/utils/applyTheme";

// Aplica o tema do clientConfig antes de renderizar
applyTheme();

createRoot(document.getElementById("root")!).render(<App />);
