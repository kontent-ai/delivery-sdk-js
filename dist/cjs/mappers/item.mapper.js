"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemMapper = void 0;
const resolvers_1 = require("../resolvers");
const element_mapper_1 = require("./element.mapper");
class ItemMapper {
    constructor(config, richTextHtmlParser) {
        this.config = config;
        this.richTextHtmlParser = richTextHtmlParser;
        this.elementMapper = new element_mapper_1.ElementMapper(config, richTextHtmlParser);
    }
    /**
     * Maps single item to its proper strongly typed model from the given Kontent response
     * @param response Kontent response used to map the item
     * @param queryConfig Query configuration
     */
    mapSingleItemFromResponse(response, queryConfig) {
        const mapResult = this.mapItems({
            mainItems: [response.item],
            linkedItems: Object.values(response.modular_content),
            queryConfig: queryConfig
        });
        return {
            item: mapResult.items[0],
            linkedItems: mapResult.linkedItems
        };
    }
    /**
     * Maps multiple items to their strongly typed model from the given Kontent response
     * @param response Kontent response used to map the item
     * @param queryConfig Query configuration
     */
    mapMultipleItemsFromResponse(response, queryConfig) {
        const mapResult = this.mapItems({
            mainItems: response.items,
            linkedItems: Object.values(response.modular_content),
            queryConfig: queryConfig
        });
        return mapResult;
    }
    /**
     * Maps item contracts to full models
     */
    mapItems(data) {
        const that = this;
        const itemResolver = data.queryConfig && data.queryConfig.itemResolver ? data.queryConfig.itemResolver : undefined;
        const processedItems = {};
        const preparedItems = {};
        const processingStartedForCodenames = [];
        const mappedMainItems = [];
        const mappedLinkedItems = {};
        const itemsToResolve = [...data.mainItems, ...data.linkedItems];
        // first prepare reference for all items
        for (const item of itemsToResolve) {
            preparedItems[item.system.codename] = resolvers_1.stronglyTypedResolver.createItemInstance({
                item: item
            }, this.config.typeResolvers || [], itemResolver);
        }
        // then resolve items
        for (const item of data.mainItems) {
            const itemResult = that.mapItem({
                item: item,
                processedItems: processedItems,
                queryConfig: data.queryConfig,
                preparedItems: preparedItems,
                processingStartedForCodenames: processingStartedForCodenames
            });
            mappedMainItems.push(itemResult.item);
        }
        for (const item of data.linkedItems) {
            const itemResult = that.mapItem({
                item: item,
                processedItems: processedItems,
                queryConfig: data.queryConfig,
                preparedItems: preparedItems,
                processingStartedForCodenames: processingStartedForCodenames
            });
            mappedLinkedItems[item.system.codename] = itemResult.item;
        }
        return {
            items: mappedMainItems,
            linkedItems: mappedLinkedItems
        };
    }
    /**
     * Maps item contract to full model
     */
    mapItem(data) {
        if (!data.item) {
            throw Error(`Could not map item because its undefined`);
        }
        const result = this.elementMapper.mapElements({
            item: data.item,
            preparedItems: data.preparedItems,
            processingStartedForCodenames: [],
            processedItems: data.processedItems,
            queryConfig: data.queryConfig
        });
        if (!result) {
            throw Error(`Mapping of content item '${data.item.system.codename}' failed`);
        }
        return {
            item: result.item,
            processedItems: result.processedItems,
            preparedItems: result.preparedItems,
            processingStartedForCodenames: result.processingStartedForCodenames
        };
    }
}
exports.ItemMapper = ItemMapper;
//# sourceMappingURL=item.mapper.js.map