import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { LocationsService } from '@shared/services/locations.service';
import { Marker } from 'leaflet';
import { Location } from '@shared/models/location.model';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LocationsComponent {
  private readonly _locationsService = inject(LocationsService);

  readonly $origin = signal('');
  readonly $originMarker = signal<Marker | null>(null);
  readonly $markers = signal<Marker[]>([]);

  map: L.Map | null = null;

  locationsResource = resource({
    request: () => ({ origin: this.$origin() }),
    loader: ({ request }) =>
      this._locationsService.getLocations(request.origin),
  });

  constructor() {
    this.getCurrentLocation();
    this.initializeMap();

    effect(() => {
      const origin = this.$origin();
      const locations = this.locationsResource.value();
      if (!origin || !locations) {
        return;
      }
      const [lat, lng] = origin.split(',').map(Number);
      this.addStoreMarkers(locations);
      this.updateMapLocation(lat, lng);
    });
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      this.$origin.set(
        `${position.coords.latitude},${position.coords.longitude}`
      );
    });
  }

  async initializeMap(): Promise<void> {
    const L = await import('leaflet');
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  async updateMapLocation(lat: number, lng: number): Promise<void> {
    if (this.map) {
      const L = await import('leaflet');
      const originMarker = this.$originMarker();
      if (originMarker) {
        originMarker.remove();
      }
      this.$originMarker.set(null);
      this.map.setView([lat, lng], 12);
      const marker = L.marker([lat, lng], {
        icon: L.icon({ iconUrl: 'assets/loc-pin.svg' }),
      }).addTo(this.map);
      this.$originMarker.set(marker);
    }
  }

  async addStoreMarkers(locations: Location[]): Promise<void> {
    if (this.map) {
      const L = await import('leaflet');
      this.$markers().forEach(marker => marker.remove());
      this.$markers.set(
        locations.map(location =>
          L.marker([location.latitude, location.longitude], {
            icon: L.icon({ iconUrl: 'assets/map-pin.svg' }),
          }).addTo(this.map!)
        )
      );
    }
  }
}
