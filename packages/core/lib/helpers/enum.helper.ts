export class EnumHelper {

    getEnumName(T: any): string {
        return T;
    }

    getAllValues(T: any): any[] {
        const allEnumValues: any[] = Object.keys(T).map(key => T[key]);

        return allEnumValues;
    }

    getAllNames(T: any): any[] {
        const enumNames: any[] = [];

        // tslint:disable-next-line:forin
        for (const enumMember in T) {
            enumNames.push(enumMember);
        }

        return enumNames;
    }

    getEnumNameFromValue(T: any, value: string): string {
        let keyResult = '';
        for (const enumKey in T) {
            if (value === T[enumKey]) {
                keyResult = enumKey;
                break;
            }
        }
        return keyResult;
    }

    getEnumFromName<T>(T: any, name: string): T | undefined {
        return T[name];
    }

    getEnumFromValue<T>(T: any, value: string | number, defaultValue: T): T {
        try {

            if (!value) {
                return defaultValue;
            }

            // we can map back from number directiy
            if (this.isNumber(value)) {
                return <T>T[value];
            }

            // for strings, we need to compare each value separately..
            const allEnumValues = this.getAllValues(T);

            const result = allEnumValues.find(m => m.toLowerCase() === value.toString().toLowerCase());
            if (!result) {
                return defaultValue;
            }

            return result as T;
        } catch (err) {
            console.warn(`Could not parse enum value '${value}'`);
            return defaultValue;
        }
    }

    private isNumber(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
}

export const enumHelper = new EnumHelper();
