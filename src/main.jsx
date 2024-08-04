import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SupabaseAuthProvider } from "./integrations/supabase/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./integrations/supabase";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <App />
      </SupabaseAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
