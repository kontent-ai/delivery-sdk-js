import { ListContentItemsQuery } from '../queries';

export interface IContentManagementClient {

    listContentItems(): ListContentItemsQuery;
}
