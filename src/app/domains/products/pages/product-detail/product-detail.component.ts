import {
  Component,
  inject,
  input,
  linkedSignal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { MetaTagsService } from '@shared/services/meta-tags.service';
import { RelatedComponent } from '@products/components/related/related.component';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage, RelatedComponent],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailComponent {
  private readonly _productService = inject(ProductService);
  private readonly _cartService = inject(CartService);
  private readonly _metaTagsService = inject(MetaTagsService);

  readonly slug = input.required<string>();
  readonly productResource = rxResource({
    request: () => ({ slug: this.slug() }),
    loader: ({ request }) =>
      this._productService.getOne({ slug: request.slug }),
  });
  readonly $cover = linkedSignal({
    source: this.productResource.value,
    computation: (product, previousValue) =>
      product && product.images.length > 0 ? product.images[0] : previousValue,
  });

  constructor() {
    effect(() => {
      this.setMetadata();
    });
  }

  setMetadata() {
    const product = this.productResource.value();
    if (product) {
      this._metaTagsService.updateMetaTags({
        title: `${product.title} - Ng Store`,
        description: product.description,
        image: `${environment.domain}${this.$cover()}`,
        url: `${environment.domain}/products/${product.slug}`,
      });
    }
  }

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productResource.value();
    if (product) {
      this._cartService.addToCart(product);
    }
  }
}
