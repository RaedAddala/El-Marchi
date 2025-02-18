import {Component, inject, OnInit, WritableSignal, signal, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectParams } from 'ngxtension/inject-params';
import { Router } from '@angular/router';
import {interval, take} from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CartService } from '../../cart.service';
import { ToastService } from '@shared/toast/toast.service';
import { UserProductService } from '@features/products/user-product.service';
import { ProductCardComponent } from '@features/products/pages/product-card/product-card.component';
import { Pagination } from '@shared/models/request.model';
import { Product } from '@shared/models/product.model';
import { environment } from '../../../../../../environments/environment.development';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
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

  product: WritableSignal<Product | null> = signal(null);
  relatedProducts: Product[] = [];
  isLoading = false;
  isLoadingRelated = false;

  apiUrl = environment.apiUrlUploads;
  constructor() {
    this.handlePublicIdChange();
    effect(() => {
      const product = this.product();
      if (product) {
        this.loadImage(product.pictures[0].publicId);
      }
    });
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
        this.product.set(product);
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

  imageUrl: SafeUrl | undefined;
  santaizer = inject(DomSanitizer);
  loadImage(publicId: string): void {
    this.productService.getImage(publicId).subscribe((blob) => {
      console.log('Blob size:', blob.size); // Check the size of the Blob
      if (blob.size === 0) {
        console.error('Blob is empty');
        return;
      }

      const objectURL = URL.createObjectURL(blob);
      console.log('Blob URL:', objectURL); // Log the Blob URL
      this.imageUrl = this.santaizer.bypassSecurityTrustUrl(objectURL);
    });
  }
}
