import { ContentType, FieldType } from 'kentico-cloud-delivery';

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

    getClassDefinition(type: ContentType, moduleResolution: ModuleResolution, codeType: CodeType): string {
        let definition = `
${this.getImports(type, moduleResolution, codeType).join('\n')}
${codeType === CodeType.TypeScript ? generatorConfig.tsNotice : generatorConfig.jsNotice}
${this.getExportClass(type, moduleResolution)}
    `;

// include fields only for ts
if (codeType === CodeType.TypeScript) {
    definition += `${this.getContentTypeFields(type, moduleResolution).join(`
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
            requiredImport = `import { ${generatorConfig.itemBaseClass}, ${generatorConfig.fieldsNamespace} } from '${generatorConfig.npmPackage}';`;
        } else if (moduleType === ModuleResolution.CommonJs) {
            requiredImport = `var ${generatorConfig.CommonJsRequiredName} = require('${generatorConfig.npmPackage}');`;
        } else {
            throw Error(`Unsupported module type '${moduleType}'`);
        }

        const imports = [requiredImport];

        return imports;
    }

    private getContentTypeFields(type: ContentType, moduleResolution: ModuleResolution): string[] {
        const properties: string[] = [];
        const that = this;

        type.elements.forEach(element => {
            const property = `public ${that.getPropertyName(element.codename)}: ${moduleResolution === ModuleResolution.CommonJs ? (generatorConfig.CommonJsRequiredName + '.') : ''}${that.mapFieldTypeToName(element.type)};`;
            properties.push(property);
        });

        return properties;
    }

    private getConstructor(type: ContentType, codeType: CodeType): string | undefined {
        const fieldBindings: string[] = [];
        let explicitFieldReturn = '';
        const that = this;

        type.elements.forEach(element => {
            if (that.propertyRequiresCapitalization(element.codename)) {
                const propertyName = that.getPropertyName(element.codename);
                const binding =
                    `if (fieldName === '${element.codename}') {
                    return '${propertyName}';
                }`;
                fieldBindings.push(binding);
            }
        });

        if (fieldBindings.length <= 0) {
            return undefined;
        } else {
            explicitFieldReturn = `return fieldName;`;
        }

        const constructor =
            `    constructor() {
        super({
            ${generatorConfig.propertyResolver}: ((fieldName${codeType === CodeType.TypeScript ? ': string' : ''}) => {
                ${fieldBindings.join(`
                `)}
                ${explicitFieldReturn}
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

    private mapFieldTypeToName(fieldType: string): string {
        let result;
        if (fieldType.toLowerCase() === FieldType.Text.toLowerCase()) {
            result = 'TextField';
        } else if (fieldType.toLowerCase()  === FieldType.Number.toLowerCase() ) {
            result = 'NumberField';
        } else if (fieldType.toLowerCase()  === FieldType.ModularContent.toLowerCase() ) {
            // we don't what type of linked item there can be or if its an array or single object
            // => use base content item class
            return generatorConfig.modularFieldReplacement;
        } else if (fieldType.toLowerCase()  === FieldType.Asset.toLowerCase() ) {
            result = 'AssetsField';
        } else if (fieldType.toLowerCase()  === FieldType.DateTime.toLowerCase() ) {
            result = 'DateTimeField';
        } else if (fieldType.toLowerCase()  === FieldType.RichText.toLowerCase() ) {
            result = 'RichTextField';
        } else if (fieldType.toLowerCase()  === FieldType.MultipleChoice.toLowerCase() ) {
            result = 'MultipleChoiceField';
        } else if (fieldType.toLowerCase()  === FieldType.UrlSlug.toLowerCase() ) {
            result = 'UrlSlugField';
        } else if (fieldType.toLowerCase()  === FieldType.Taxonomy.toLowerCase() ) {
            result = 'TaxonomyField';
        } else if (fieldType.toLowerCase()  === FieldType.Custom.toLowerCase() ) {
            result = 'CustomField';
        } else {
            console.log(`Unsupported field type '${fieldType}'`);
        }
        return generatorConfig.fieldsNamespace + '.' + result;
    }
}

export const modelHelper = new ModelHelper();
