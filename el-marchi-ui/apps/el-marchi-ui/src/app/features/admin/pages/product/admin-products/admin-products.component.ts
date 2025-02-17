import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AdminProductService } from '@features/admin/admin-product.service';
import { ToastService } from '@shared/toast/toast.service';
import { Pagination } from '@shared/models/request.model';
import { HttpClient } from '@angular/common/http';
import { Product } from '@shared/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  productService = inject(AdminProductService);
  toastService = inject(ToastService);
  http = inject(HttpClient);

  pageRequest: Pagination = {
    page: 0,
    size: 20,
    sort: ['createdDate,desc'],
  };

  products: Product[] = [];
  loading = false;
  error = false;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = false;
    this.productService.findAllProducts(this.pageRequest).subscribe({
      next: data => {
        this.products = data.content;
        console.log('products', this.products);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.toastService.show(
          'Error failed to load products, please try again',
          'ERROR',
        );
      },
    });
  }

  deleteProduct(publicId: string) {
    this.productService.deleteProduct(publicId).subscribe({
      next: () => {
        // Manually remove the deleted product from the array
        this.products = this.products.filter(product => product.id !== publicId);
        this.toastService.show('Product deleted', 'SUCCESS');
      },
      error: () => this.onDeletionError(),
    });
  }

  private onDeletionError() {
    this.toastService.show('Issue when deleting product', 'ERROR');
  }
}
