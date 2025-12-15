import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '@/app/AppProvider';
import { CacheProvider } from '@emotion/react';
import { muiCache } from '@/cache/emotionCache';
import App from '@/app/App';
import '@/styles/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={muiCache}>
      <AppProvider>
        <App />
      </AppProvider>
    </CacheProvider>
  </StrictMode>,
);
