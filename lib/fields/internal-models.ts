export class Parse5Node {
    constructor(
        public nodeName: string,
        public parentNode: Parse5Node,
        public value?: string,
        public tagName?: string,
        public childNodes?: Parse5Node[],
        public attrs?: Parse5Attribute[]
    ) { }
}

export class Parse5Attribute {
    constructor(
        public name: string,
        public value: string
    ) { }
}