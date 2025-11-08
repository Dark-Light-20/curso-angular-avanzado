import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

export interface PageMetaData {
  title: string;
  description: string;
  image: string;
  url: string;
}

const defaultMetaData: PageMetaData = {
  title: 'Ng Store',
  description: 'The best store in Angular',
  image: '',
  url: environment.domain,
};

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  private readonly _titleService = inject(Title);
  private readonly _metaTagService = inject(Meta);

  updateMetaTags(metaData: Partial<PageMetaData>) {
    const metaToUpdate: PageMetaData = {
      ...defaultMetaData,
      ...metaData,
    };

    const metaTagDefinitions = this.generateMetaTagDefinitions(metaToUpdate);

    metaTagDefinitions.forEach(tag => this._metaTagService.updateTag(tag));
    this._titleService.setTitle(metaToUpdate.title);
  }

  private generateMetaTagDefinitions(metaData: PageMetaData): MetaDefinition[] {
    return [
      { name: 'title', content: metaData.title },
      {
        name: 'description',
        content: metaData.description,
      },
      {
        property: 'og:title',
        content: metaData.title,
      },
      {
        property: 'og:image',
        content: metaData.image,
      },
      {
        property: 'og:description',
        content: metaData.description,
      },
      { name: 'og:url', content: metaData.url },
    ];
  }
}
