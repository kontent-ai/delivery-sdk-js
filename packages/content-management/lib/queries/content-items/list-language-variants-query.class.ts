import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../../config';
import { ContentItemElements, ContentItemIdentifier, ContentItemModels } from '../../models';
import { ContentItemResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ListLanguageVariantsQuery<TElements extends ContentItemModels.ContentItemVariantElements> extends BaseQuery<ContentItemResponses.ListLanguageVariantsResponse<TElements>> {

  private fieldDefinitions?: ContentItemElements.IContentItemElementDefinition[];
  private createElements?: () => TElements;

  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService,
    protected identifier: ContentItemIdentifier,
    protected identifierValue: string
  ) {
    super(config, queryService);
  }

  toObservable(): Observable<ContentItemResponses.ListLanguageVariantsResponse<TElements>> {
    return this.queryService.listLanguageVariants<TElements>(this.getUrl(), this.fieldDefinitions ? this.fieldDefinitions : [], this.getCreateElements(), this.queryConfig);
  }

  withFields(createElements: () => TElements, fieldDefinitions: ContentItemElements.IContentItemElementDefinition[]): this {
    this.fieldDefinitions = fieldDefinitions;
    this.createElements = createElements;
    return this;
  }

  protected getAction(): string {
    if (this.identifier === ContentItemIdentifier.InternalId) {
      return this.actions.contentItemActions.listLanguageVariantsByInternalId(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.Codename) {
      return this.actions.contentItemActions.listLanguageVariantsByCodename(this.identifierValue);
    }
    if (this.identifier === ContentItemIdentifier.ExternalId) {
      return this.actions.contentItemActions.listLanguageVariantsByExternalId(this.identifierValue);
    }

    throw Error(`Item identifier type '${this.identifier}' is not supported`);
  }

  private getCreateElements(): () => TElements {
    return this.createElements ? this.createElements : () => new ContentItemModels.ContentItemVariantElements() as TElements;
  }
}

export class ListLanguageVariantsQueryInit<TElements extends ContentItemModels.ContentItemVariantElements> {
  constructor(
    protected config: IContentManagementClientConfig,
    protected queryService: ContentManagementQueryService
  ) {
  }

  /**
   * Gets query for content item using internal Id
   * @param id Internal Id of content item
   */
  byInternalId(id: string): ListLanguageVariantsQuery<TElements> {
    return new ListLanguageVariantsQuery(this.config, this.queryService, ContentItemIdentifier.InternalId, id);
  }

  /**
 * Gets query for content item using external Id
 * @param id External Id of content item
 */
  byExternalId(id: string): ListLanguageVariantsQuery<TElements> {
    return new ListLanguageVariantsQuery(this.config, this.queryService, ContentItemIdentifier.ExternalId, id);
  }

  /**
 * Gets query for content item using codename
 * @param codename Codename of content item
 */
  byCodename(codename: string): ListLanguageVariantsQuery<TElements> {
    return new ListLanguageVariantsQuery(this.config, this.queryService, ContentItemIdentifier.Codename, codename);
  }
}

