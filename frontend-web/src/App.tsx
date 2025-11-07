import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeContextProvider } from './presentation/components/ui/ThemeProvider';
import { AppLayout } from './presentation/components/layout/AppLayout';
import { routes } from './presentation/routes/routes';

function App() {
  const routing = useRoutes(routes);

  return (
    <ThemeContextProvider>
      <AppLayout>{routing}</AppLayout>
    </ThemeContextProvider>
  );
}

export default App;