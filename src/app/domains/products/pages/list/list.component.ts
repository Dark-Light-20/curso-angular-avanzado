import { Component, inject, signal, OnChanges, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ProductComponent } from '@products/components/product/product.component';

import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { CategoryService } from '@shared/services/category.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLinkWithHref],
  templateUrl: './list.component.html',
})
export default class ListComponent implements OnChanges {
  private readonly _cartService = inject(CartService);
  private readonly _productService = inject(ProductService);
  private readonly _categoryService = inject(CategoryService);

  readonly slug = input<string>();

  products = signal<Product[]>([]);
  $categories = toSignal(this._categoryService.getAll(), {
    initialValue: [],
  });

  ngOnChanges() {
    this.getProducts();
  }

  addToCart(product: Product) {
    this._cartService.addToCart(product);
  }

  private getProducts() {
    this._productService
      .getProducts({
        category_slug: this.slug(),
      })
      .subscribe({
        next: products => {
          this.products.set(products);
        },
      });
  }
}
