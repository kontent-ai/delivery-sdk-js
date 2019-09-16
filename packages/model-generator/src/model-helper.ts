import { ContentType, ElementType } from '@kentico/kontent-delivery';

import { generatorConfig } from './config';
import { CodeType, ModuleResolution } from './enums';
import { utilities } from './utilities';

export class ModelHelper {

    getFullClassFileName(type: ContentType, codeType: CodeType): string {
        if (codeType === CodeType.JavaScript) {
            return this.getClassFilename(type) + '.js';
        } else if (codeType === CodeType.TypeScript) {
            return this.getClassFilename(type) + '.ts';
        }

        throw Error(`Unsupported code type '${codeType}'`);
    }

    getClassDefinition(type: ContentType, moduleResolution: ModuleResolution, codeType: CodeType, strictPropertyInitalization: boolean): string {
        let definition = `
${this.getImports(type, moduleResolution, codeType).join('\n')}
${codeType === CodeType.TypeScript ? generatorConfig.tsNotice : generatorConfig.jsNotice}
${this.getExportClass(type, moduleResolution)}
    `;

// include fields only for ts
if (codeType === CodeType.TypeScript) {
    definition += `${this.getContentTypeElements(type, moduleResolution, strictPropertyInitalization).join(`
    `).trim()}
`;
}

        const constructor = this.getConstructor(type, codeType);

        if (constructor) {
            definition += constructor;
        }

        definition += `}
`;
        return definition;
    }

    private getExportClass(type: ContentType, moduleResolution: ModuleResolution): string {
        if (moduleResolution === ModuleResolution.ES2015) {
            return `export class ${this.getClassName(type)} extends ${generatorConfig.itemBaseClass} {`;
        } else if (moduleResolution === ModuleResolution.CommonJs) {
            return `export class ${this.getClassName(type)} extends ${generatorConfig.CommonJsRequiredName}.${generatorConfig.itemBaseClass} {`;
        }

        throw Error(`Unsupported module type '${moduleResolution}'`);
    }

    private getImports(type: ContentType, moduleType: ModuleResolution, codeType: CodeType): string[] {
        let requiredImport;
        if (moduleType === ModuleResolution.CommonJs && codeType === CodeType.TypeScript) {
            requiredImport = `import * as ${generatorConfig.CommonJsRequiredName} from '${generatorConfig.npmPackage}';`;
        } else if (moduleType === ModuleResolution.ES2015) {
            requiredImport = `import { ${generatorConfig.itemBaseClass}, ${generatorConfig.elementsNamespace} } from '${generatorConfig.npmPackage}';`;
        } else if (moduleType === ModuleResolution.CommonJs) {
            requiredImport = `var ${generatorConfig.CommonJsRequiredName} = require('${generatorConfig.npmPackage}');`;
        } else {
            throw Error(`Unsupported module type '${moduleType}'`);
        }

        const imports = [requiredImport];

        return imports;
    }

    private getContentTypeElements(type: ContentType, moduleResolution: ModuleResolution, strictPropertyInitalization: boolean): string[] {
        const properties: string[] = [];
        const that = this;

        type.elements.forEach(element => {
            const property = `public ${that.getPropertyName(element.codename)}${this.getStrictInitialization(strictPropertyInitalization)}: ${this.getModuleResolution(moduleResolution)}${that.mapElementTypeToName(element.type)};`;
            properties.push(property);
        });

        return properties;
    }

    private getModuleResolution(moduleResolution: ModuleResolution): string {
        return `${moduleResolution === ModuleResolution.CommonJs ? (generatorConfig.CommonJsRequiredName + '.') : ''}`;
    }

    private getStrictInitialization(strictPropertyInitalization: boolean): string {
        if (strictPropertyInitalization) {
            return `!`;
        }
        return '';
    }

    private getConstructor(type: ContentType, codeType: CodeType): string | undefined {
        const fieldBindings: string[] = [];
        let explicitElementReturn = '';
        const that = this;

        type.elements.forEach(element => {
            if (that.propertyRequiresCapitalization(element.codename)) {
                const propertyName = that.getPropertyName(element.codename);
                const binding =
                    `if (elementName === '${element.codename}') {
                    return '${propertyName}';
                }`;
                fieldBindings.push(binding);
            }
        });

        if (fieldBindings.length <= 0) {
            return undefined;
        } else {
            explicitElementReturn = `return elementName;`;
        }

        const constructor =
            `    constructor() {
        super({
            ${generatorConfig.propertyResolver}: ((elementName${codeType === CodeType.TypeScript ? ': string' : ''}) => {
                ${fieldBindings.join(`
                `)}
                ${explicitElementReturn}
            })
        });
    }
`;
        return constructor;
    }

    private propertyRequiresCapitalization(codename: string) {
        if (!generatorConfig.uppercaseAfterUnderscoreReplacement) {
            return false;
        }
        return codename.indexOf('_') !== -1;
    }

    private getPropertyName(codename: string): string {
        if (!generatorConfig.uppercaseAfterUnderscoreReplacement) {
            return codename;
        }
        return utilities.toPascalCase(codename);
    }

    private getClassName(type: ContentType): string {
        return utilities.toPascalCase(utilities.capitalizeFirstLetter(type.system.codename));
    }

    private getClassFilename(type: ContentType): string {
        return type.system.codename;
    }

    private mapElementTypeToName(elementType: string): string {
        let result: string = '';
        if (elementType.toLowerCase() === ElementType.Text.toLowerCase()) {
            result = 'TextElement';
        } else if (elementType.toLowerCase()  === ElementType.Number.toLowerCase() ) {
            result = 'NumberElement';
        } else if (elementType.toLowerCase()  === ElementType.ModularContent.toLowerCase() ) {
            result = `LinkedItemsElement<${generatorConfig.itemBaseClass}>`;
        } else if (elementType.toLowerCase()  === ElementType.Asset.toLowerCase() ) {
            result = 'AssetsElement';
        } else if (elementType.toLowerCase()  === ElementType.DateTime.toLowerCase() ) {
            result = 'DateTimeElement';
        } else if (elementType.toLowerCase()  === ElementType.RichText.toLowerCase() ) {
            result = 'RichTextElement';
        } else if (elementType.toLowerCase()  === ElementType.MultipleChoice.toLowerCase() ) {
            result = 'MultipleChoiceElement';
        } else if (elementType.toLowerCase()  === ElementType.UrlSlug.toLowerCase() ) {
            result = 'UrlSlugElement';
        } else if (elementType.toLowerCase()  === ElementType.Taxonomy.toLowerCase() ) {
            result = 'TaxonomyElement';
        } else if (elementType.toLowerCase()  === ElementType.Custom.toLowerCase() ) {
            result = 'CustomElement';
        } else {
            console.warn(`Unsupported element type '${elementType}'`);
        }
        return generatorConfig.elementsNamespace + '.' + result;
    }
}

export const modelHelper = new ModelHelper();
