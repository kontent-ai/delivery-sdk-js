import { CodeType, ModuleResolution } from './enums';

export class Utilities {

    getModuleResolution(moduleResolution: ModuleResolution): ModuleResolution {
        if (moduleResolution.toLowerCase() === ModuleResolution.ES2015.toLowerCase()) {
            return ModuleResolution.ES2015;
        }

        if (moduleResolution.toLowerCase() === ModuleResolution.CommonJs.toLowerCase()) {
            return ModuleResolution.CommonJs;
        }

        throw Error(`Invalid module resolution option '${moduleResolution}'`);
    }

    getCodeType(codeType: string): CodeType {
        if (codeType.toLowerCase() === CodeType.JavaScript.toLowerCase()) {
            return CodeType.JavaScript;
        }

        if (codeType.toLowerCase() === CodeType.TypeScript.toLowerCase()) {
            return CodeType.TypeScript;
        }

        throw Error(`Invalid code type option '${codeType}'`);
    }

    capitalizeFirstLetter(text: string): string {
        if (!text) {
            return '';
        }
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    toPascalCase(text: string): string {
        if (!text) {
            return '';
        }

        let pascalCaseName = '';

        const arr = text.split('_');
        for (let i = 0; i < arr.length; i++) {
            let part = arr[i];

            if (i > 0) {
                part = this.capitalizeFirstLetter(part);
            }

            pascalCaseName += part;
        }

        return pascalCaseName;
    }
}

export const utilities = new Utilities();


