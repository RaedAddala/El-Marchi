import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxControlError } from 'ngxtension/control-error';
import { AdminProductService } from '@features/admin/admin-product.mock.service';
import { ToastService } from '@shared/toast/toast.service';
import {
  CreateCategoryFormContent,
  ProductCategory,
} from '@features/admin/models/product.model';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxControlError],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
})
export class CreateCategoryComponent {
  formBuilder = inject(FormBuilder);
  productService = inject(AdminProductService);
  toastService = inject(ToastService);
  router = inject(Router);

  name = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  public createForm =
    this.formBuilder.nonNullable.group<CreateCategoryFormContent>({
      name: this.name,
    });

  loading = false;

  create(): void {
    if (this.createForm.invalid) {
      return;
    }

    const categoryToCreate: ProductCategory = {
      name: this.createForm.getRawValue().name,
    };

    this.loading = true;
    this.productService.createCategory(categoryToCreate).subscribe({
      next: () => this.onCreationSuccess(),
      error: () => this.onCreationError(),
      complete: () => this.onCreationSettled(),
    });
  }

  private onCreationSettled(): void {
    this.loading = false;
  }

  private onCreationSuccess(): void {
    this.toastService.show('Category created', 'SUCCESS');
    this.router.navigate(['/admin/categories/list']);
  }

  private onCreationError(): void {
    this.toastService.show('Issue when creating category', 'ERROR');
  }
}
