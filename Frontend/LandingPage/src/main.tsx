import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { UserProvider } from './context/UserContext.tsx'; // Adjusted path assuming it's in the same directory
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/features/customer/components/ui/tooltip"; // Corrected path
import { Toaster as ShadToaster } from "@/features/customer/components/ui/toaster"; // Corrected path
import { Toaster as SonnerToaster } from "sonner"; // Adjusted import from sonner directly

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <App />
            <ShadToaster />
            <SonnerToaster />
          </TooltipProvider>
        </QueryClientProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
