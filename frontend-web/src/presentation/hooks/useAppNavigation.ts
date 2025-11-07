import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../routes/routes';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    // Navigation methods
    goToHome: () => navigate(ROUTES.HOME),
    goToMaterials: () => navigate(ROUTES.MATERIALS),
    goToMaterialDetail: (id: string) => navigate(ROUTES.MATERIAL_DETAIL(id)),
    goToOrders: () => navigate(ROUTES.ORDERS),
    goToOrderDetail: (id: string) => navigate(ROUTES.ORDER_DETAIL(id)),
    goToOptimization: () => navigate(ROUTES.OPTIMIZATION),
    goToOptimizationDetail: (id: string) =>
      navigate(ROUTES.OPTIMIZATION_DETAIL(id)),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),

    // Current location info
    currentPath: location.pathname,
    isActive: (path: string) => location.pathname === path,
    isActiveRoute: (path: string) => location.pathname.startsWith(path),

    // Generic navigation
    navigate,
    location,
  };
};