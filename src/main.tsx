import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';
import UserLoginProvider from './components/ui/login/UserLoginProvider';
import './index.css';
import './assets/fonts/Yekan-Bakh-FaNum-05-Medium.woff';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <UserLoginProvider>
          <App />
          <ToastContainer />
        </UserLoginProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);