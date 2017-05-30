import { ITypeElement } from '../../interfaces/type/itype-element.interface';

export class TypeElement implements ITypeElement {
    constructor(
        public type: string,
        public name: string
    ){}
}