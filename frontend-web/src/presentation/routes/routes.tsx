import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loading } from '../components/ui/Loading';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('../pages/Dashboard'));
const MaterialsPage = lazy(() => import('../pages/Materials'));
const OrdersPage = lazy(() => import('../pages/Orders'));
const OptimizationPage = lazy(() => import('../pages/Optimization'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

// Wrapper component for lazy loaded routes
const LazyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<Loading centered message="Loading page..." />}>
    {children}
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <LazyRoute>
        <Dashboard />
      </LazyRoute>
    ),
  },
  {
    path: '/materials',
    element: (
      <LazyRoute>
        <MaterialsPage />
      </LazyRoute>
    ),
  },
  {
    path: '/materials/:id',
    element: (
      <LazyRoute>
        <MaterialsPage />
      </LazyRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <LazyRoute>
        <OrdersPage />
      </LazyRoute>
    ),
  },
  {
    path: '/orders/:id',
    element: (
      <LazyRoute>
        <OrdersPage />
      </LazyRoute>
    ),
  },
  {
    path: '/optimization',
    element: (
      <LazyRoute>
        <OptimizationPage />
      </LazyRoute>
    ),
  },
  {
    path: '/optimization/:id',
    element: (
      <LazyRoute>
        <OptimizationPage />
      </LazyRoute>
    ),
  },
  {
    path: '*',
    element: (
      <LazyRoute>
        <NotFoundPage />
      </LazyRoute>
    ),
  },
];

// Route paths constants for type-safe navigation
export const ROUTES = {
  HOME: '/',
  MATERIALS: '/materials',
  MATERIAL_DETAIL: (id: string) => `/materials/${id}`,
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  OPTIMIZATION: '/optimization',
  OPTIMIZATION_DETAIL: (id: string) => `/optimization/${id}`,
} as const;