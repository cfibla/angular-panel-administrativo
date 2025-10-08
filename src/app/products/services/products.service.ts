import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);

  private productsCache = new Map<string,ProductsResponse>();
  private oneProductCache = new Map<string,Product>();

  getProducts(options:Options): Observable<ProductsResponse> {

    const { limit = 9, offset = 0, gender = '' } = options;

    //TODO key para la cache
    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }


    return this.http
    .get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    })
    .pipe(
      tap((resp) => console.log(resp)),
      tap((resp) => this.productsCache.set(key, resp))
    )
  }

  getProductsByIdSlug(idSlug: string): Observable<Product> {
    const key = idSlug;
    if (this.oneProductCache.has(key)) {
      return of(this.oneProductCache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      tap((prod) => console.log(prod)),
      tap((prod) => this.oneProductCache.set(key, prod))
    )
  }
  getProductsById(id: string): Observable<Product> {
    const key = id;
    if (this.oneProductCache.has(key)) {
      return of(this.oneProductCache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((prod) => console.log(prod)),
      tap((prod) => this.oneProductCache.set(key, prod))
    )
  }

}
