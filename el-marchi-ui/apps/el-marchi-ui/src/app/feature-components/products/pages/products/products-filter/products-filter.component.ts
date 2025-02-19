import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FilterProductsFormContent,
  ProductFilter,
  ProductFilterForm,
  sizes,
} from '@shared/models/product.model';
import {
  FormBuilder,
  FormControl,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  sort = input<string>('createdDate,asc');
  size = input<string>();

  productFilter = output<ProductFilter>();
  formBuilder = inject(FormBuilder);

  constructor() {
    effect(() => this.updateSizeFormValue());
    effect(() => this.updateSortFormValue());
    this.formFilterProducts.valueChanges.subscribe(() =>
      this.onFilterChange(this.formFilterProducts.getRawValue()),
    );
  }

  formFilterProducts =
    this.formBuilder.nonNullable.group<FilterProductsFormContent>({
      sort: new FormControl<string>(this.sort().split(',')[1], {
        nonNullable: true,
        validators: [Validators.required],
      }),
      size: this.buildSizeFormControl(),
    });

  private buildSizeFormControl(): FormRecord<FormControl<boolean>> {
    const sizeFormControl = this.formBuilder.nonNullable.record<
      FormControl<boolean>
    >({});
    for (const size of sizes) {
      sizeFormControl.addControl(
        size,
        new FormControl<boolean>(false, { nonNullable: true }),
      );
    }
    return sizeFormControl;
  }

  private onFilterChange(filter: Partial<ProductFilterForm>) {
    const filterProduct: ProductFilter = {
      filtersize: '',
      filtersort: [`${filter.sort}`],
    };

    let sizes: [string, boolean][] = [];
    if (filter.size !== undefined) {
      sizes = Object.entries(filter.size);
    }

    for (const [sizeKey, sizeValue] of sizes) {
      if (sizeValue) {
        if (filterProduct.filtersize?.length === 0) {
          filterProduct.filtersize = sizeKey;
        } else {
          filterProduct.filtersize += `,${sizeKey}`;
        }
      }
    }
    this.productFilter.emit(filterProduct);
  }

  public getSizeFormGroup(): FormRecord<FormControl<boolean>> {
    return this.formFilterProducts.get('size') as FormRecord<
      FormControl<boolean>
    >;
  }

  private updateSizeFormValue() {
    const currentSize = this.size();
    if (currentSize) {
      const sizes = currentSize.split(',');
      const sizeFormGroup = this.getSizeFormGroup();

      sizes.forEach(size => {
        const control = sizeFormGroup.get(size);
        if (control) {
          control.setValue(true, { emitEvent: false });
        }
      });
    }
  }

  private updateSortFormValue() {
    const currentSort = this.sort();
    if (currentSort) {
      this.formFilterProducts.controls.sort.setValue(
        currentSort.split(',')[1],
        { emitEvent: false },
      );
    }
  }

  protected readonly sizes = sizes;
}
