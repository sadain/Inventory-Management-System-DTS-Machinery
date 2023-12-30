import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./bootstrap.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ContextProvider>
    <QueryClientProvider client={queryClient}>
      <App queryClient={queryClient} />
    </QueryClientProvider>
  </ContextProvider>
);
