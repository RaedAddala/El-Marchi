import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProductService } from '../../../features/shop/user-product.service';
import { Pagination } from '../../../shared/models/request.model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'featured',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss',
})
export class FeaturedComponent {
  productService = inject(UserProductService);

  pageRequest: Pagination = {
    page: 0,
    size: 20,
    sort: [],
  };

  featuredProductQuery = injectQuery(() => ({
    queryKey: ['featured-products', this.pageRequest],
    queryFn: () =>
      lastValueFrom(
        this.productService.findAllFeaturedProducts(this.pageRequest)
      ),
  }));
}