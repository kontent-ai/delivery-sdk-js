import { IHeader } from '../../interfaces/common/iheader.interface';

export class Header implements IHeader {
    constructor(
        public header: string,
        public value: string
    ) { }
}