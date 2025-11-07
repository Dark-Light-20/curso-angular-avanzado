import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Location } from '@shared/models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private readonly _apiLocationsUrl = `${environment.apiUrl}/api/v1/locations`;

  async getLocations(origin?: string): Promise<Location[]> {
    const url = new URL(this._apiLocationsUrl);
    if (origin) {
      url.searchParams.set('origin', origin);
    }
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  }
}
