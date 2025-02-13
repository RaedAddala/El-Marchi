import type { Routes } from '@angular/router';
//import {roleCheckGuard} from "@features/admin/guards/role-check.guard";

export const ADMIN_ROUTES: Routes = [
  {
    path: 'products/list',
    loadComponent: () =>
      import('./pages/product/admin-products/admin-products.component').then(
        m => m.AdminProductsComponent,
      ),
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import('./pages/product/create-product/create-product.component').then(
        m => m.CreateProductComponent,
      ),
  },

  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders.component').then(m => m.OrdersComponent),
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./pages/customers/customers.component').then(
        m => m.CustomersComponent,
      ),
  },
  {
    path: 'categories/list',
    loadComponent: () =>
      import(
        './pages/category/admin-categories/admin-categories.component'
      ).then(m => m.AdminCategoriesComponent),
    /*canActivate: [roleCheckGuard],
    data: {
      authorities: ['ROLE_ADMIN'],
    }*/
  },
  {
    path: 'categories/create',
    loadComponent: () =>
      import('./pages/category/create-category/create-category.component').then(
        m => m.CreateCategoryComponent,
      ),
    /*canActivate: [roleCheckGuard],
    data: {
      authorities: ['ROLE_ADMIN'],
    }*/
  },
  //subcategoriescreate
  {
    path: 'subcategories/:id/create',
    loadComponent: () =>
      import(
        './pages/category/create-subcategory/create-subcategory.component'
      ).then(m => m.CreateSubCategoryComponent),
    /*canActivate: [roleCheckGuard],
    data: {
      authorities: ['ROLE_ADMIN'],
    }*/
  },
];
