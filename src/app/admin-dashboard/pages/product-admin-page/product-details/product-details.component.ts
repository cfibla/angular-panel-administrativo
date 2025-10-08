import { Component, inject, input } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent {
  product = input.required<Product>();

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', Validators.required, Validators.pattern(FormUtils.slugPattern)],
    price: [0, Validators.required, Validators.min(0)],
    stock: [0, Validators.required, Validators.min(0)],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', Validators.required, Validators.pattern(/men|women|kid|unisex/)],
  })

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  onSubmit() {
    console.log(this.productForm.value);
  }
}
