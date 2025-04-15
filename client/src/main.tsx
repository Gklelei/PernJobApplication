import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AppContextProvider } from "./Context/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Router>
          <App />
          <Toaster richColors position="bottom-right" />
        </Router>
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
