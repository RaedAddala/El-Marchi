import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectParams } from 'ngxtension/inject-params';
import { Router } from '@angular/router';
import { interval, take } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CartService } from '../../cart.service';
import { ToastService } from '@shared/toast/toast.service';
import { UserProductService } from '@features/products/user-product.service';
import { ProductCardComponent } from '@features/products/pages/product-card/product-card.component';
import { Pagination } from '@shared/models/request.model';
import { Product } from '@shared/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FaIconComponent, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
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

  product: Product | null = null;
  relatedProducts: Product[] = [];
  isLoading = false;
  isLoadingRelated = false;

  constructor() {
    this.handlePublicIdChange();
  }

  ngOnInit(): void {
    console.log('ProductDetailComponent initialized');
    this.loadProduct();
    this.loadRelatedProducts();
  }

  private loadProduct() {
    const currentPublicId = this.publicId();
    if (!currentPublicId) return;

    this.isLoading = true;
    this.productService.findOneByPublicId(currentPublicId).subscribe({

      next: product => {
        this.product = product;
        this.isLoading = false;
        console.log('Product loaded:', product);
      },
      error: () => {
        this.toastService.show(
          'Error! Failed to load product. Please try again.',
          'ERROR',
        );
        this.isLoading = false;
      },
    });
  }

  private loadRelatedProducts() {
    const currentPublicId = this.publicId();
    if (!currentPublicId) return;

    this.isLoadingRelated = true;
    this.productService
      .findRelatedProduct(this.pageRequest, currentPublicId)
      .subscribe({
        next: relatedProducts => {
          this.relatedProducts = relatedProducts.content;
          this.isLoadingRelated = false;
        },
        error: () => {
          this.toastService.show(
            'Error! Failed to load related products. Please try again.',
            'ERROR',
          );
          this.isLoadingRelated = false;
        },
      });
  }

  private handlePublicIdChange() {
    const currentPublicId = this.publicId();
    if (currentPublicId && this.lastPublicId !== currentPublicId) {
      this.lastPublicId = currentPublicId;
      this.loadProduct();
      this.loadRelatedProducts();
    }
  }

  addToCart(productToAdd: Product) {

    console.log('we are in product detail component');
    this.cartService.addToCart(productToAdd.id, 'add');
    this.labelAddToCart = 'Added to cart';
    this.iconAddToCart = 'check';



    interval(3000)
      .pipe(take(1))
      .subscribe(() => {
        this.labelAddToCart = 'Add to cart';
        this.iconAddToCart = 'shopping-cart';
      });
  }
}
