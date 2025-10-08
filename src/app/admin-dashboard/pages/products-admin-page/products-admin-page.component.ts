import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from "@products/components/product-table/product-table.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/pagination/pagination.service';
import { PaginationComponent } from "@shared/pagination/pagination.component";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsPerPage = signal(10)

  productsResource = rxResource({
    params: () => ({
      page:this.paginationService.currentPage()-1,
      limit: this.productsPerPage()
    }),
    stream:({params}) => {
      return this.productsService.getProducts({
        offset: (params.page) * this.productsPerPage(),
        limit: params.limit
      });
    },
  });
}
