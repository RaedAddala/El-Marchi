import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProductService } from '../../../features/products/user-product.mock.service';
import { Pagination } from '../../../shared/models/request.model';
import { catchError, of } from 'rxjs';
import { Product } from '@features/admin/models/product.model';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.css',
})
export class FeaturedComponent implements OnInit {
  productService = inject(UserProductService);

  pageRequest: Pagination = {
    page: 0,
    size: 20,
    sort: [],
  };

  featuredProducts: Product[] = [];
  isLoading = true;
  isError = false;

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.isLoading = true;
    this.isError = false;

    this.productService
      .findAllFeaturedProducts(this.pageRequest)
      .pipe(
        catchError(() => {
          this.isError = true;
          return of(null);
        }),
      )
      .subscribe(response => {
        this.isLoading = false;
        if (response) {
          this.featuredProducts = response.content;
        }
      });
  }
}
