import { PropertyNameResolver } from '../../models';

export const camelCasePropertyNameResolver: PropertyNameResolver = (contentType, element) => {
    return camelize(element);
};

function camelize(str: string): string {
    str = str.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}
