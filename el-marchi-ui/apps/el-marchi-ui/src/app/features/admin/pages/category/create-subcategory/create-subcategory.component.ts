import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxControlError } from 'ngxtension/control-error';
import { AdminProductService } from '@features/admin/admin-product.service';
import { ToastService } from '@shared/toast/toast.service';

@Component({
  selector: 'app-create-subcategory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxControlError],
  templateUrl: './create-subcategory.component.html',
  styleUrl: './create-subcategory.component.css',
})
export class CreateSubCategoryComponent {
  formBuilder = inject(FormBuilder);
  productService = inject(AdminProductService);
  toastService = inject(ToastService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  name = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  public createForm = this.formBuilder.nonNullable.group({
    name: this.name,
  });

  loading = false;
  categoryId!: string;

  ngOnInit() {
    this.categoryId = this.route.snapshot.params['id'];
  }

  create(): void {
    if (this.createForm.invalid) {
      return;  // Stops if the form is invalid.
    }

    const subCategoryToCreate = {
      name: this.createForm.getRawValue().name,  // Extracting name from form value.
    };

    this.loading = true;

    this.productService.createSubCategory(this.categoryId, subCategoryToCreate).subscribe({
      next: () => {
        this.onCreationSuccess();  // Handle successful creation
      },
      error: () => {
        this.onCreationError(); // Handle error in creation
      },
      complete: () => {
        this.onCreationSettled();  // Final actions once the request completes
      },
    });
  }


  private onCreationSettled(): void {
    this.loading = false;
  }

  private onCreationSuccess(): void {
    this.toastService.show('Subcategory created', 'SUCCESS');
    this.router.navigate(['admin/categories/list']);
  }

  private onCreationError(): void {
    this.toastService.show('Issue when creating subcategory', 'ERROR');
  }
}
