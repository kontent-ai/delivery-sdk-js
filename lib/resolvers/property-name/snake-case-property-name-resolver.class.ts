import { PropertyNameResolver } from '../../models';

export const snakeCasePropertyNameResolver: PropertyNameResolver = (contentType, element) => {
    return toSnakeCase(element);
};

function toSnakeCase(str: string): string {
    const matches = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
    if (matches) {
        return matches.map((x) => x.toLowerCase()).join('_');
    }
    return str;
}
