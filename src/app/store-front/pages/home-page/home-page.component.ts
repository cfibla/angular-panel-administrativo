import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@shared/pagination/pagination.component";
import { PaginationService } from '@shared/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);

  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({page:this.paginationService.currentPage()}),
    stream:({params}) => {
      return this.productsService.getProducts({
        offset: (params.page - 1) * 9,
      });
    },
  });
}

