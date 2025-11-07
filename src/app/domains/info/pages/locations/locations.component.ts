import {
  afterNextRender,
  Component,
  inject,
  resource,
  signal,
} from '@angular/core';
import { LocationsService } from '@shared/services/locations.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  private readonly _locationsService = inject(LocationsService);

  readonly $origin = signal('');

  locationsResource = resource({
    request: () => ({ origin: this.$origin() }),
    loader: ({ request }) =>
      this._locationsService.getLocations(request.origin),
  });

  constructor() {
    afterNextRender(() => {
      this.getCurrentLocation();
    });
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      this.$origin.set(
        `${position.coords.latitude},${position.coords.longitude}`
      );
    });
  }
}
