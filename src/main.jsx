import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { isSupabaseConfigured } from "./lib/supabase";
import "./index.css";

if (import.meta.env.DEV) {
  console.info("[Lumenote] isSupabaseConfigured:", isSupabaseConfigured());
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
