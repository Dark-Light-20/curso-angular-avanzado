import { Component, inject, input, linkedSignal, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { Meta, Title } from '@angular/platform-browser';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent {
  readonly slug = input.required<string>();

  productResource = rxResource({
    request: () => ({ slug: this.slug() }),
    loader: ({ request }) => this.productService.getOne({ slug: request.slug }),
  });
  $cover = linkedSignal({
    source: this.productResource.value,
    computation: (product, previousValue) =>
      product && product.images.length > 0 ? product.images[0] : previousValue,
  });

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  private readonly _titleService = inject(Title);
  private readonly _metaTagService = inject(Meta);

  constructor() {
    effect(() => {
      this.setMetadata();
    });
  }

  setMetadata() {
    const product = this.productResource.value();
    if (product) {
      this._titleService.setTitle(product.title);
      this._metaTagService.updateTag({
        name: 'description',
        content: product.description,
      });
      this._metaTagService.updateTag({
        property: 'og:title',
        content: product.title,
      });
      this._metaTagService.updateTag({
        property: 'og:image',
        content: product.images[0],
      });
      this._metaTagService.updateTag({
        property: 'og:description',
        content: product.description,
      });
      this._metaTagService.updateTag({
        name: 'og:url',
        content: `${environment.domain}/product/${product.slug}`,
      });
    }
  }

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productResource.value();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
