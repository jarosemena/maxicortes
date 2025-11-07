import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeContextProvider } from './presentation/components/ui/ThemeProvider';
import { AppLayout } from './presentation/components/layout/AppLayout';
import { routes } from './presentation/routes/routes';
import { useMaterialsStore } from './application/stores/useMaterialsStore';
import { initializeMaterialsStore } from './infrastructure/data/seedMaterials';

function App() {
  const routing = useRoutes(routes);
  const { materials, setMaterials } = useMaterialsStore();

  // Initialize with seed data on first load
  useEffect(() => {
    if (materials.length === 0) {
      initializeMaterialsStore(setMaterials);
    }
  }, [materials.length, setMaterials]);

  return (
    <ThemeContextProvider>
      <AppLayout>{routing}</AppLayout>
    </ThemeContextProvider>
  );
}

export default App;