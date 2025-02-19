import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxControlError } from 'ngxtension/control-error';
import { AdminProductService } from '@shared/service/admin-product.service';
import { ToastService } from '@shared/toast/toast.service';
import {
  BaseProduct,
  CategoryWithSubcategories,
  ProductPicture,
  ProductSizes,
  sizes,
} from '@shared/models/product.model';
import { v4 as uuidv4 } from 'uuid';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxControlError,
    FaIconComponent,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private productService = inject(AdminProductService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public productFiles: File[] = []; // Store the actual File objects
  public productPictures: ProductPicture[] = []; // Store the metadata
  public availableSubcategories: CategoryWithSubcategories[] = [];
  public categories: CategoryWithSubcategories[] = [];
  public loading = false;

  // Define the subcategory control explicitly
  name = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ],
  });

  brand = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  color = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  description = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500),
    ],
  });

  price = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1)],
  });

  stock = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), Validators.max(1000)],
  });

  size = new FormControl<ProductSizes>('XS', {
    nonNullable: true,
    validators: [Validators.required],
  });

  parentCategory = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  subcategory = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  featured = new FormControl<boolean>(false, {
    nonNullable: true,
    validators: [Validators.required],
  });

  pictures = new FormControl<ProductPicture[]>([], {
    nonNullable: true,
    validators: [
      Validators.required,
      control => (control.value.length > 0 ? null : { picturesRequired: true }),
    ],
  });

  // Define the form group
  createForm = this.formBuilder.nonNullable.group({
    name: this.name,
    brand: this.brand,
    color: this.color,
    description: this.description,
    price: this.price,
    stock: this.stock,
    size: this.size,
    parentCategory: this.parentCategory,
    subcategory: this.subcategory,
    featured: this.featured,
    pictures: this.pictures,
  });

  ngOnInit() {
    this.loadCategories();
    //trgir chnage and console log the invalid form fields make  apipe that just take chage after 1 second and last value
    this.createForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(value => {
        console.log('Form value changes', value);
        //pritn fields that are invalid
        Object.keys(this.createForm.controls).forEach(field => {
          const control = this.createForm.get(field);
          if (control?.invalid) {
            console.log('Invalid field:', field);
          }
        });
      });
  }

  loadCategories() {
    this.productService.findAllCategories(0, 100).subscribe({
      next: data => {
        this.categories = data.content;
        this.loadSubcategoriesForAll();
      },
      error: err => {
        console.error('Failed to load categories', err);
        this.toastService.show('Failed to load categories', 'ERROR');
      },
    });
  }

  onParentCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedCategoryId = select.value;

    this.subcategory.setValue(''); // Reset the subcategory value
    if (!selectedCategoryId) {
      this.availableSubcategories = [];
      this.subcategory.disable(); // Disable the subcategory control
      return;
    }

    const selectedCategory = this.categories.find(
      cat => cat.publicId === selectedCategoryId,
    );
    if (selectedCategory) {
      this.productService
        .findSubcategoriesByCategoryId(selectedCategoryId)
        .subscribe({
          next: subcategories => {
            this.availableSubcategories = subcategories;
            this.subcategory.enable(); // Enable the subcategory control
          },
          error: error => {
            console.error('Failed to load subcategories', error);
            this.toastService.show('Failed to load subcategories', 'ERROR');
            this.availableSubcategories = [];
            this.subcategory.disable(); // Disable the subcategory control on error
          },
        });
    }
  }

  create(): void {
    if (this.createForm.invalid) {
      this.toastService.show('Please fill out the form correctly', 'ERROR');
      return;
    }

    const formValues = this.createForm.getRawValue();
    const subcategoryValues = formValues.subcategory.split('+');

    const productToCreate: BaseProduct = {
      brand: formValues.brand,
      color: formValues.color,
      description: formValues.description,
      name: formValues.name,
      price: formValues.price,
      size: formValues.size,
      subCategory: {
        publicId: subcategoryValues[0],
        name: subcategoryValues[1],
      },
      featured: formValues.featured,
      pictures: this.productPictures, // Pass the metadata
      nbInStock: formValues.stock,
    };

    this.loading = true;
    this.productService
      .createProduct(productToCreate, this.productFiles)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/products/list']);
          this.toastService.show('Product created', 'SUCCESS');
        },
        error: () => {
          this.toastService.show('Issue when creating product', 'ERROR');
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  loadSubcategoriesForAll() {
    this.categories.forEach(category => {
      if (category.publicId) {
        this.loadSubcategoriesForCategory(category);
      }
    });
  }

  loadSubcategoriesForCategory(category: CategoryWithSubcategories) {
    if (!category.publicId) return;
    this.productService
      .findSubcategoriesByCategoryId(category.publicId)
      .subscribe({
        next: subcategories => {
          category.subcategories = subcategories;
        },
        error: () => {
          this.toastService.show(
            `Failed to load subcategories for ${category.name || 'category'}`,
            'ERROR',
          );
        },
      });
  }

  async onUploadNewPicture(target: EventTarget | null) {
    this.productFiles = []; // Clear previous files
    this.productPictures = []; // Clear previous metadata

    const picturesFileList = this.extractFileFromTarget(target);

    if (picturesFileList) {
      for (let i = 0; i < picturesFileList.length; i++) {
        const file = picturesFileList.item(i);
        if (file) {
          const publicId = uuidv4();
          const productPicture: ProductPicture = {
            publicId,
            mimeType: file.type,
          };

          try {
            this.productFiles.push(file); // Store the File object
            this.productPictures.push(productPicture); // Store the metadata
          } catch (error) {
            this.toastService.show('Failed to upload image', 'ERROR');
          }
        }
      }
    }
    //ypdate the form control
    this.pictures.setValue(this.productPictures);
  }

  private extractFileFromTarget(target: EventTarget | null): FileList | null {
    const htmlInputTarget = target as HTMLInputElement;
    return htmlInputTarget?.files;
  }

  protected readonly sizes = sizes;
}
