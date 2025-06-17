// ===================================================================
// src/main.tsx - Updated with ProgressProvider
// ===================================================================
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProgressProvider } from "./components/providers/ProgressProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ProgressProvider
        height="3px"
        color="#D1AA6D"
        options={{
          showSpinner: false,
          easing: "ease-in-out",
          speed: 300,
          trickle: true,
          trickleSpeed: 200,
          minimum: 0.1,
        }}
      >
        <App />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </ProgressProvider>
    </QueryClientProvider>
  </StrictMode>
);