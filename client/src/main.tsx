import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
