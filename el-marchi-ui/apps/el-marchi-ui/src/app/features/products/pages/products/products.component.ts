import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsFilterComponent } from './products-filter/products-filter.component';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { Router } from '@angular/router';
import { UserProductService } from '@features/products/user-product.service';
import { ToastService } from '@shared/toast/toast.service';
import { Pagination } from '@shared/models/request.model';
import { ProductFilter } from '@shared/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { BehaviorSubject, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductsFilterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    category: this.category() ?? '',
    size: this.size() ?? '',
    sort: [this.sort() ?? 'createdDate,desc'],
  };

  lastCategory = '';

  private filterSubject = new BehaviorSubject<ProductFilter>(
    this.filterProducts,
  );

  filteredProducts$ = this.filterSubject.pipe(
    switchMap(filter =>
      this.productService.filter(this.pageRequest, filter).pipe(
        catchError(() => {
          this.toastService.show(
            'Error! Failed to load products, please try again',
            'ERROR',
          );
          return of({ content: [], totalElements: 0 });
        }),
      ),
    ),
  );

  constructor() {
    this.handleParametersChange();
  }

  ngOnInit(): void {
    this.filterSubject.next(this.filterProducts);
  }

  onFilterChange(filterProducts: ProductFilter) {
    const currentCategory = this.category() ?? '';
    filterProducts.category = currentCategory;
    this.filterProducts = filterProducts;
    this.pageRequest.sort = filterProducts.sort;
    this.router.navigate(['/products'], {
      queryParams: {
        ...filterProducts,
      },
    });
    this.filterSubject.next(this.filterProducts);
  }

  private handleParametersChange() {
    const currentCategory = this.category() ?? '';
    if (currentCategory && this.lastCategory !== currentCategory) {
      this.filterProducts = {
        category: currentCategory,
        size: this.size() ?? '',
        sort: [this.sort() ?? 'createdDate,desc'],
      };
      this.filterSubject.next(this.filterProducts);
    }
    this.lastCategory = currentCategory;
  }
}
