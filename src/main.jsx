import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SupabaseProvider } from "./integrations/supabase/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./integrations/supabase";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SupabaseProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </SupabaseProvider>
  </React.StrictMode>,
);
