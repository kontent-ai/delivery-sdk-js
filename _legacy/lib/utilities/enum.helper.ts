export class EnumHelper {
    getAllValues(T: any): string[] {
        const allEnumValues: string[] = Object.keys(T).map((key) => T[key]);
        return allEnumValues;
    }

    getEnumFromValue<T>(T: any, value: string | number): T | undefined {
        try {
            if (!value) {
                return undefined;
            }

            // we can map back from index number directly
            if (this.isNumeric(value)) {
                return <T>T[value];
            }

            // for strings, we need to compare each value separately
            const allEnumValues = this.getAllValues(T);

            const result = allEnumValues.find((m) => m.toLowerCase() === value.toString().toLowerCase());

            if (!result) {
                return undefined;
            }

            return result as T;
        } catch (err) {
            return undefined;
        }
    }

    private isNumeric(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
}

export const enumHelper = new EnumHelper();
