import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from "@products/components/product-card/product-card/product-card.component";
import { PaginationComponent } from "@shared/pagination/pagination.component";
import { PaginationService } from '@shared/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  route = inject(ActivatedRoute);
  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )
  )

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({gender:this.gender(), page:this.paginationService.currentPage()}),
    stream:({params}) => {
      return this.productsService.getProducts({gender: params.gender, offset: (params.page - 1) * 9});
    },
  });
}
