import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/auth.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap, map, forkJoin, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
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

    if (id === 'new') return of(emptyProduct);


    const key = id;
    if (this.oneProductCache.has(key)) {
      return of(this.oneProductCache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap((prod) => console.log(prod)),
      tap((prod) => this.oneProductCache.set(key, prod))
    )
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList | null
  ): Observable<Product> {

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imageFileNames) => ({
        ...productLike,
        images: [...currentImages, ...imageFileNames],
      })),
      switchMap((updatedImages) =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedImages)
      ),
      tap((product)=> this.updateProductCache(product)))
      }

    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
    // .pipe(tap((product)=> this.updateProductCache(product)))

  createProduct(productLike: Partial<Product>, imageFileList?: FileList|null): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, productLike)
    .pipe(tap((product)=> this.updateProductCache(product)))
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    //TODO actualiza la cache del producto individual
    this.oneProductCache.set(productId, product);

    //TODO actualizar la cache de los listados
    this.productsCache.forEach((productsResponse) => {
      productsResponse.products = productsResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === productId ? product : currentProduct;
        });
    })
  }

  // TODO subir imágenes
  uploadImages(images?: FileList|null):Observable<string[]> {
    if(!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) => this.uploadImage(imageFile));

    // TODO de la lista de observables,
    // TODO espera que vayan acabando cada uno antes de pasar al siguiente.
    return forkJoin(uploadObservables)
    .pipe(tap((fileNames) => console.log(fileNames)));
  }

  // TODO subir una sola imagen
  uploadImage(imageFile: File):Observable<string> {

    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
    .post<{fileName:string}>(`${baseUrl}/files/product`, formData)
    .pipe(map((resp) => resp.fileName));
  }

}
