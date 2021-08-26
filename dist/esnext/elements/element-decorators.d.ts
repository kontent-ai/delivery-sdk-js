import 'reflect-metadata';
export declare namespace ElementDecorators {
    /**
     * Get the metadata entry saved by the decorator
     * @param target - object instance
     * @param elementName - Element name (code name from Kentico Kontent)
     */
    function getPropertyName(target: any, elementName: string): any | undefined;
    /**
     * Decorator - creates metadata entry for the @target - Value is the property name.
     * This will then be retrieved when resolving the element name
     * @param value - Element code name
     */
    function codename(value: string): (target: any, propertyKey: string) => void;
}
