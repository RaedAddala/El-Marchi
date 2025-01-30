import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectParams } from 'ngxtension/inject-params';
import { Router } from '@angular/router';
import { interval, take } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CartService } from '../cart.mock.service';
import { ToastService } from '@shared/toast/toast.service';
import { UserProductService } from '@features/shop/user-product.mock.service';
import { ProductCardComponent } from '@features/shop/product-card/product-card.component';
import { Pagination } from "@shared/models/request.model";
import { Product } from "@features/admin/models/product.model";

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [CommonModule, FaIconComponent, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  publicId = injectParams('publicId');

  productService = inject(UserProductService);
  router = inject(Router);
  toastService = inject(ToastService);
  cartService = inject(CartService);

  lastPublicId = '';

  pageRequest: Pagination = {
    page: 0,
    size: 20,
    sort: [],
  };

  labelAddToCart = 'Add to cart';
  iconAddToCart = 'shopping-cart';

  product: Product | null = null; // Store the product details
  relatedProducts: Product[] = []; // Store related products
  isLoading = false; // Loading state for product details
  isLoadingRelated = false; // Loading state for related products

  constructor() {
    this.handlePublicIdChange();
  }

  ngOnInit(): void {
    this.loadProduct(); // Load product details on component initialization
    this.loadRelatedProducts(); // Load related products on component initialization
  }

  // Load product details
  private loadProduct() {
    if (!this.publicId()) return;

    this.isLoading = true;
    this.productService.findOneByPublicId(this.publicId()!).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show(
          'Error! Failed to load product. Please try again.',
          'ERROR'
        );
        this.isLoading = false;
      },
    });
  }

  // Load related products
  private loadRelatedProducts() {
    if (!this.publicId()) return;

    this.isLoadingRelated = true;
    this.productService
      .findRelatedProduct(this.pageRequest, this.publicId()!)
      .subscribe({
        next: (relatedProducts) => {
          this.relatedProducts = relatedProducts.content;
          this.isLoadingRelated = false;
        },
        error: () => {
          this.toastService.show(
            'Error! Failed to load related products. Please try again.',
            'ERROR'
          );
          this.isLoadingRelated = false;
        },
      });
  }

  // Handle publicId changes
  private handlePublicIdChange() {
    if (this.publicId() && this.lastPublicId !== this.publicId()) {
      this.lastPublicId = this.publicId()!;
      this.loadProduct(); // Reload product details
      this.loadRelatedProducts(); // Reload related products
    }
  }

  // Add product to cart
  addToCart(productToAdd: Product) {
    this.cartService.addToCart(productToAdd.publicId, 'add');
    this.labelAddToCart = 'Added to cart';
    this.iconAddToCart = 'check';

    // Reset the button after 3 seconds
    interval(3000)
      .pipe(take(1))
      .subscribe(() => {
        this.labelAddToCart = 'Add to cart';
        this.iconAddToCart = 'shopping-cart';
      });
  }
}
