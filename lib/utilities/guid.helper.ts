import { v4 as uuidv4 } from 'uuid';

export class GuidHelper {
    genereateGuid(): string {
        return uuidv4();
    }
}

export const guidHelper = new GuidHelper();
