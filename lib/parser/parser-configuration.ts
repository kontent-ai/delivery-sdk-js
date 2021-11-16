
export const parserConfiguration = {
    linkedItemWrapperElem: 'div',
    modularContentElementData: {
        type: 'application/kenticocloud',
        dataType: 'data-type',
        dataCodename: 'data-codename',
        relAttribute: 'data-rel',
        componentRel: 'component'
    },
    linkElementData: {
        nodeName: 'a',
        dataItemId: 'data-item-id',
    },
    imageElementData: {
        nodeName: 'img',
        dataImageId: 'data-image-id',
        srcAttribute: 'src'
    },
    resolvedLinkedItemIndexAttribute: 'data-sdk-item-index',
    resolvedAttribute: 'data-sdk-resolved'

};
