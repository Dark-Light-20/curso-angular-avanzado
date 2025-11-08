import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '@shared/services/product.service';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-related',
  imports: [ProductComponent],
  templateUrl: './related.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedComponent {
  private readonly _productService = inject(ProductService);

  readonly $slug = input.required<string>({ alias: 'slug' });
  readonly relatedResource = rxResource({
    request: () => ({ slug: this.$slug() }),
    loader: ({ request }) =>
      this._productService.getRelatedProducts({ slug: request.slug }),
  });
}
