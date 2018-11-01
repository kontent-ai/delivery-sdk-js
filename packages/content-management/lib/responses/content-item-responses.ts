import { IContentItemsListingResponseContract, IViewContentItemResponseContract } from '../contracts';
import { BaseContentManagementResponse, IContentManagementResponseDebug } from './base-responses';
import { PaginationModel } from './shared-responses';

export class ContentItemModel {
    public id: string;
    public name: string;
    public codename: string;
    public type: {
        id: string
    };
    public sitemapLocations: [{
        id: string
    }];
    public externalId?: string;
    public lastModified: Date;

    constructor(
        data: {
            id: string,
            name: string,
            codename: string,
            type: {
                id: string
            },
            sitemapLocations: [{
                id: string
            }],
            externalId?: string,
            lastModified: Date
        }
    ) {
        Object.assign(this, data);
    }
}

export class ContentItemsResponse extends BaseContentManagementResponse<IContentItemsListingResponseContract,
    {
        items: ContentItemModel[],
        pagination: PaginationModel
    }>  {
    constructor(
        debug: IContentManagementResponseDebug,
        rawData: IContentItemsListingResponseContract,
        data: {
            items: ContentItemModel[],
            pagination: PaginationModel
        }
    ) {
        super(debug, rawData, data);
    }
}

export class ViewContentItemResponse extends BaseContentManagementResponse<IViewContentItemResponseContract, ContentItemModel> {

    data: ContentItemModel;

    constructor(
        debug: IContentManagementResponseDebug,
        rawData: IViewContentItemResponseContract,
        data: ContentItemModel
    ) {
        super(debug, rawData, data);
    }
}

