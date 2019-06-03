import { ItemContracts } from '../../data-contracts';

export interface ITypeResolverData {
    item: ItemContracts.IContentItemContract;
    modularContent: ItemContracts.IModularContentWrapperContract;
}
