import 'reflect-metadata';

export namespace ElementDecorators {
  const codenameMetadataKey = Symbol('codename');

  const generateKey = (name: string) => `${codenameMetadataKey.toString()}:${name}`;

  /**
   * Get the metadata entry saved by the decorator
   * @param target - object instance
   * @param elementName - Element name (code name from Kentico Cloud)
   */
  export function getPropertyName(target: any, elementName: string): any | undefined {
    return Reflect.getMetadata(generateKey(elementName), target);
  }

  /**
   * Decorator - creates metadata entry for the @target - Value is the property name.
   * This will then be retrieved when resolving the element name
   * @param value - Element code name
   */
  export function codename(value: string): (target: any, propertyKey: string) => void {
    return function (target: any, propertyKey: string) {
      Reflect.defineMetadata(generateKey(value), propertyKey, target);
    };
  }
}
