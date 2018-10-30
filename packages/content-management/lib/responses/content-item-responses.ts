import { IContentItemsListingResponseContract } from '../contracts';
import {
    BaseContentManagementResponse,
    IContentManagementResponse,
    IContentManagementResponseDebug,
} from './base-responses';

export class ContentItemsResponse extends BaseContentManagementResponse<IContentItemsListingResponseContract> implements IContentManagementResponse<IContentItemsListingResponseContract> {

    data: IContentItemsListingResponseContract;

    constructor(
        debug: IContentManagementResponseDebug,
        data: IContentItemsListingResponseContract
    ) {
        super(debug, data);
    }
}
