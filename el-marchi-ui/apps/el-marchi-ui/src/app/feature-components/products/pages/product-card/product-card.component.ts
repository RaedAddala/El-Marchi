import {
  Component,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '@shared/models/product.model';
import { UserProductService } from '@shared/service/user-product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  productService = inject(UserProductService);
  sanitizer = inject(DomSanitizer);
  product = input.required<Product>();
  imageUrl: WritableSignal<SafeUrl | null> = signal(null);
  constructor() {
    effect(() => {
      this.loadImage(this.product().pictures[0].publicId);
    });
  }
  loadImage(publicId: string): void {
    this.productService.getImage(publicId).subscribe(blob => {
      console.log('Blob size:', blob.size); // Check the size of the Blob
      if (blob.size === 0) {
        console.error('Blob is empty');
        return;
      }

      const objectURL = URL.createObjectURL(blob);
      console.log('Blob URL:', objectURL); // Log the Blob URL
      this.imageUrl.set(this.sanitizer.bypassSecurityTrustUrl(objectURL));
    });
  }
}
