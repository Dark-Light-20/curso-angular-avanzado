import { Component, inject, input, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ProductComponent } from '@products/components/product/product.component';

import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { CategoryService } from '@shared/services/category.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLinkWithHref],
  templateUrl: './list.component.html',
})
export default class ListComponent {
  private readonly _cartService = inject(CartService);
  private readonly _productService = inject(ProductService);
  private readonly _categoryService = inject(CategoryService);

  readonly slug = input<string>();

  categoriesResource = resource({
    loader: () => this._categoryService.getAllPromise(),
  });

  productsResource = rxResource({
    request: () => ({ category_slug: this.slug() }),
    loader: ({ request }) => this._productService.getProducts(request),
  });

  addToCart(product: Product) {
    this._cartService.addToCart(product);
  }

  resetCategories() {
    this.categoriesResource.set([]);
  }

  reloadCategories() {
    this.categoriesResource.reload();
  }

  reloadProducts() {
    this.productsResource.reload();
  }
}
