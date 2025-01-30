import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AdminProductService } from '@features/admin/admin-product.mock.service';
import { ToastService } from '@shared/toast/toast.service';
import { HttpClient } from '@angular/common/http';
import { ProductCategory } from '@features/admin/models/product.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css',
})
export class AdminCategoriesComponent implements OnInit {
  productAdminService = inject(AdminProductService);
  toastService = inject(ToastService);
  http = inject(HttpClient);

  categories: ProductCategory[] = [];
  loading = false;
  error = false;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.error = false;
    this.productAdminService.findAllCategories().subscribe({
      next: data => {
        this.categories = data.content;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.toastService.show(
          'Error! Failed to load categories. Please try again.',
          'ERROR',
        );
      },
    });
  }

  deleteCategory(publicId: string) {
    this.productAdminService.deleteCategory(publicId).subscribe({
      next: () => this.onDeletionSuccess(),
      error: () => this.onDeletionError(),
    });
  }

  private onDeletionSuccess(): void {
    this.loadCategories(); // Refresh the categories list
    this.toastService.show('Category deleted', 'SUCCESS');
  }

  private onDeletionError(): void {
    this.toastService.show('Issue when deleting category', 'ERROR');
  }
}
