import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage, NotFoundPage } from '@/components/pages';
import { DashboardLayout } from '@/components/templates';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'tasks',
        element: <></>,
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
