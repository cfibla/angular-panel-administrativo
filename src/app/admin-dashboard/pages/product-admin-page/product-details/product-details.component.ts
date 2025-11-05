import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from "@shared/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit{
  product = input.required<Product>();
  productsService = inject(ProductsService);
  router = inject(Router);

  wasSaved = signal(false)

  tempImages = signal<string[]>([])
  imageFileList: FileList | null | undefined = null;
  imagesToCarousel = computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImages()];

    return currentProductImages;
  })


  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  })

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(formLike as any); // TODO inicia el form
    this.productForm.patchValue({
      tags: formLike.tags?.join(', ')
    })
  }

  onSizeClick(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

      this.productForm.patchValue({ sizes: currentSizes })
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...( formValue as any),
      tags: formValue.tags?.split(',').map(tag => tag.trim().toLowerCase()) ?? []
    }

    if(this.product().id === 'new') {

      //TODO firstValueFrom() Converts an observable to a promise by subscribing to the observable,
      //TODO and returning a promise that will resolve as soon as the first value arrives from the observable.
      //TODO The subscription will then be closed.

      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      )

      console.log('Producto creado');
          this.router.navigate(['/admin/products', product.id]);


    } else {

      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      )

      console.log('Producto actualizado');
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 2500)

  }

  // TODO implementar subida de imagenes
  onFilesSelected(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList;
    const imageUrls = Array.from(fileList ?? []).map(file => URL.createObjectURL(file));
    this.tempImages.set(imageUrls)
  }
}
