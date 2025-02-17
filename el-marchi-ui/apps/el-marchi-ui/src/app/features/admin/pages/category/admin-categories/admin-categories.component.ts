import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AdminProductService } from '@features/admin/admin-product.service';
import { ToastService } from '@shared/toast/toast.service';
import {
  CategoryWithSubcategories,
  ProductCategory,
} from '@shared/models/product.model';
import { Page } from '@shared/models/request.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent],
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss'],
})
export class AdminCategoriesComponent implements OnInit {
  private productAdminService = inject(AdminProductService);
  private toastService = inject(ToastService);

  categories: CategoryWithSubcategories[] = [];
  pageData: Page<ProductCategory> = {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: { sorted: false, unsorted: true, empty: true },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    totalElements: 0,
    totalPages: 0,
    last: true,
    size: 10,
    number: 0,
    numberOfElements: 0,
    first: true,
    empty: true,
    sort: { sorted: false, unsorted: true, empty: true },
  };

  loading = false;
  loadingMore = false;
  error = false;

  ngOnInit() {
    this.loadCategories(0, 10); // Default page and size
  }

  loadCategories(page: number, size: number) {
    this.loading = true;
    this.error = false;

    this.productAdminService.findAllCategories(page, size).subscribe({
      next: page => {
        this.pageData = page;
        this.categories = page.content.map(category => ({
          ...category,
          subcategories: undefined,
        }));
        this.loading = false;

        this.loadSubcategoriesForAll();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.toastService.show('Error! Failed to load categories.', 'ERROR');
      },
    });
  }

  loadMoreCategories() {
    if (this.loadingMore || this.pageData.last) return;

    this.loadingMore = true;
    const nextPage = this.pageData.number + 1;

    this.productAdminService
      .findAllCategories(nextPage, this.pageData.size)
      .subscribe({
        next: page => {
          this.pageData = page;
          const newCategories = page.content.map(category => ({
            ...category,
            subcategories: undefined,
          }));
          this.categories = [...this.categories, ...newCategories];
          this.loadingMore = false;
          this.loadSubcategoriesForAll();
        },
        error: () => {
          this.loadingMore = false;
          this.toastService.show('Error loading more categories', 'ERROR');
        },
      });
  }

  loadSubcategoriesForAll() {
    this.categories.forEach(category => {
      console.log('category');
      console.log(category);
      if (category.publicId) {
        console.log('category.publicId');
        console.log(category.publicId);
        this.loadSubcategoriesForCategory(category);
      }
    });
  }

  loadSubcategoriesForCategory(category: CategoryWithSubcategories) {
    if (!category.publicId) return;
    console.log('category.publicId');
    console.log(category.publicId);
    this.productAdminService
      .findSubcategoriesByCategoryId(category.publicId)
      .subscribe({
        next: subcategories => {
          console.log('subcategories');
          console.log(subcategories);
          category.subcategories = subcategories;
        },
        error: () => {
          this.toastService.show(
            `Failed to load subcategories for ${category.name || 'category'}`,
            'ERROR',
          );
        },
      });
  }

  deleteCategory(publicId: string) {
    this.productAdminService.deleteCategory(publicId).subscribe({
      next: () => {
        this.toastService.show('Category deleted successfully', 'SUCCESS');
        this.loadCategories(0, 10); // Reload the categories after deletion
      },
      error: () => {
        this.toastService.show('Failed to delete category', 'ERROR');
      },
    });
  }
}
