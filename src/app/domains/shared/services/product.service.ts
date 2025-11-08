import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(params: { category_id?: string; category_slug?: string }) {
    const url = new URL(`${environment.apiUrl}/api/v1/products`);
    if (params.category_id) {
      url.searchParams.set('categoryId', params.category_id);
    }
    if (params.category_slug) {
      url.searchParams.set('categorySlug', params.category_slug);
    }
    return this.http.get<Product[]>(url.toString());
  }

  getOne(params: { id?: string; slug?: string }) {
    const url = new URL(`${environment.apiUrl}/api/v1/products`);
    if (params.id) {
      url.href += `/${params.id}`;
    } else if (params.slug) {
      url.href += `/slug/${params.slug}`;
    }
    return this.http.get<Product>(url.toString());
  }

  getRelatedProducts(params: { id?: string; slug?: string }) {
    const url = new URL(`${environment.apiUrl}/api/v1/products`);
    if (params.id) {
      url.href += `/${params.id}/related`;
    } else if (params.slug) {
      url.href += `/slug/${params.slug}/related`;
    }
    return this.http.get<Product[]>(url.toString());
  }
}
