export function isArray<T>(a: T | readonly T[]): a is readonly T[] {
	return Array.isArray(a);
}
