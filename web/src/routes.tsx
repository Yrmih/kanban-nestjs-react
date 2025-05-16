import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom';

import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';

import { LoadingPage } from './shared/components/LoadingPage';
import { RequireAuth } from './shared/components/RequireAuth';

import { AuthLayout } from './shared/layouts';

import { App } from './App';

const HomePage = lazy(() => import('./pages/home'));

// FLAG para ignorar login temporariamente
const SKIP_AUTH = true;

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        index
        element={
          SKIP_AUTH ? (
            <Suspense fallback={<LoadingPage />}>
              <HomePage />
            </Suspense>
          ) : (
            <RequireAuth>
              <Suspense fallback={<LoadingPage />}>
                <HomePage />
              </Suspense>
            </RequireAuth>
          )
        }
      />
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Route>
  )
);
