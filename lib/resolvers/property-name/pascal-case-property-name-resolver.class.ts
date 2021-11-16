import { PropertyNameResolver } from '../../models';

export const pascalCasePropertyNameResolver: PropertyNameResolver = (contentType, element) => {
    return camelize(element);
};

function camelize(str: string): string {
    str = str.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}
