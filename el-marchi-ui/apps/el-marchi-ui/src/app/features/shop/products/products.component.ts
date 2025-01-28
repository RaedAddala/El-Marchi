import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsFilterComponent } from './products-filter/products-filter.component';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { Router } from '@angular/router';
import { UserProductService } from '@features/shop/user-product.service';
import { ToastService } from '@shared/toast/toast.service';
import { Pagination } from '@shared/models/request.model';
import { ProductFilter } from '@features/admin/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { BehaviorSubject, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductsFilterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  category = injectQueryParams('category');
  size = injectQueryParams('size');
  sort = injectQueryParams('sort');
  productService = inject(UserProductService);
  router = inject(Router);
  toastService = inject(ToastService);

  pageRequest: Pagination = {
    page: 0,
    size: 20,
    sort: ['createdDate,desc'],
  };

  filterProducts: ProductFilter = {
    category: this.category(),
    size: this.size() ? this.size()! : '',
    sort: [this.sort() ? this.sort()! : ''],
  };

  lastCategory = '';

  // Use a BehaviorSubject to manage filter changes
  private filterSubject = new BehaviorSubject<ProductFilter>(this.filterProducts);
  filteredProducts$ = this.filterSubject.pipe(
    switchMap((filter) =>
      this.productService.filter(this.pageRequest, filter).pipe(
        catchError(() => {
          this.toastService.show(
            'Error! Failed to load products, please try again',
            'ERROR'
          );
          return of({ content: [], totalElements: 0 }); // Return an empty array on error
        })
      )
    )
  );

  constructor() {
    this.handleParametersChange();
  }

  ngOnInit(): void {
    // Trigger initial load
    this.filterSubject.next(this.filterProducts);
  }

  // Handle filter changes
  onFilterChange(filterProducts: ProductFilter) {
    filterProducts.category = this.category();
    this.filterProducts = filterProducts;
    this.pageRequest.sort = filterProducts.sort;
    this.router.navigate(['/products'], {
      queryParams: {
        ...filterProducts,
      },
    });
    this.filterSubject.next(this.filterProducts); // Emit new filter values
  }

  // Handle query parameter changes
  private handleParametersChange() {
    if (this.category()) {
      if (this.lastCategory != this.category() && this.lastCategory !== '') {
        this.filterProducts = {
          category: this.category(),
          size: this.size() ? this.size()! : '',
          sort: [this.sort() ? this.sort()! : ''],
        };
        this.filterSubject.next(this.filterProducts); // Emit new filter values
      }
    }
    this.lastCategory = this.category()!;
  }
}
