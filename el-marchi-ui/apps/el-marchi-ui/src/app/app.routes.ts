import type { Route } from '@angular/router';
import { NotFoundComponent } from './layout-pages/not-found/not-found.component';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layout-pages/home-layout/home/home.component').then(m => m.HomeComponent),
    title: 'El-Marchi - Home',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./feature-components/products/products.routes').then(
        m => m.PRODUCTS_ROUTES,
      ),
    title: 'El-Marchi - Products',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./feature-components/auth/auth.routes').then(m => m.AUTH_ROUTES),
    title: 'El-Marchi - Authentication',
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./feature-components/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    // We'll add an auth guard later
    // canActivate: [() => import('./guards/auth.guard').then(m => m.authGuard())],
    title: 'El-Marchi - Admin',
  },
  {
    path: '404',
    component: NotFoundComponent,
    title: 'El-Marchi - Page Not Found',
  },

  {
    path: '**',
    redirectTo: '404',
  },
];
