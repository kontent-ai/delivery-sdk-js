export class Parse5utils {

    private readonly namespaceURI = 'http://www.w3.org/1999/xhtml';

    append(parent: any, node: any): any {
        node.parentNode = parent;
        parent.childNodes.push(node);
        return node;
    }

    setText(node: any, text: string): any {
        node.childNodes = [];
        this.append(node, this.createTextNode(text || ''));
        return node;
    }

    createTextNode(text: string): any {
        return {
            nodeName: '#text',
            value: text
        };
    }

    createNode(tagName: String) {
        return {
            nodeName: tagName,
            tagName: tagName,
            attrs: [],
            namespaceURI: this.namespaceURI,
            childNodes: []
        };
    }

    replaceNode(original: any, node: any): any | undefined {
        const children = original.parentNode.childNodes;
        const index = children.indexOf(original);
        if (!index) { return; }
        node.parentNode = original.parentNode;
        children.splice(index, 1, node);
        return node;
    }
}

export const parse5Utils = new Parse5utils();
