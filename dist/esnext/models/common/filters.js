export var Filters;
(function (Filters) {
    const valueSeparator = ',';
    const defaultValue = '';
    const getParamValueForSystemFilter = (param) => {
        if (!param) {
            return defaultValue;
        }
        if (Array.isArray(param)) {
            let value = '';
            // use [in] filter
            for (let i = 0; i < param.length; i++) {
                value = value + param[i].toString();
                if (i !== param.length - 1) {
                    // append separator if its not last item
                    value = value + valueSeparator;
                }
            }
            return value;
        }
        // single param was given
        return param.toString();
    };
    class TypeFilter {
        constructor(type) {
            this.type = type;
        }
        getParam() {
            if (Array.isArray(this.type)) {
                // multiple types
                return `system.type[in]=${getParamValueForSystemFilter(this.type)}`;
            }
            // single type
            return `system.type=${getParamValueForSystemFilter(this.type)}`;
        }
    }
    Filters.TypeFilter = TypeFilter;
    class CollectionFilter {
        constructor(collection) {
            this.collection = collection;
        }
        getParam() {
            if (Array.isArray(this.collection)) {
                // multiple collections
                return `system.collection[in]=${getParamValueForSystemFilter(this.collection)}`;
            }
            // single collection
            return `system.collection=${getParamValueForSystemFilter(this.collection)}`;
        }
    }
    Filters.CollectionFilter = CollectionFilter;
    class EmptyFilter {
        constructor(element) {
            this.element = element;
            if (!this.element) {
                throw Error(`Element specified in 'EmptyFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[empty]`;
        }
    }
    Filters.EmptyFilter = EmptyFilter;
    class NotEmptyFilter {
        constructor(element) {
            this.element = element;
            if (!this.element) {
                throw Error(`Element specified in 'NotEmptyFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[nempty]`;
        }
    }
    Filters.NotEmptyFilter = NotEmptyFilter;
    class EqualsFilter {
        constructor(element, value) {
            this.element = element;
            this.value = value;
            if (!this.element) {
                throw Error(`Element specified in 'EqualsFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[eq]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.value) {
                return defaultValue;
            }
            return this.value;
        }
    }
    Filters.EqualsFilter = EqualsFilter;
    class NotEqualsFilter {
        constructor(element, value) {
            this.element = element;
            this.value = value;
            if (!this.element) {
                throw Error(`Element specified in 'NotEqualsFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[neq]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.value) {
                return defaultValue;
            }
            return this.value;
        }
    }
    Filters.NotEqualsFilter = NotEqualsFilter;
    class AllFilter {
        constructor(element, values) {
            this.element = element;
            this.values = values;
            if (!this.element) {
                throw Error(`Element specified in 'AllFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[all]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }
            return this.values.map(m => m.trim()).join(',');
        }
    }
    Filters.AllFilter = AllFilter;
    class AnyFilter {
        constructor(element, values) {
            this.element = element;
            this.values = values;
            if (!this.element) {
                throw Error(`Element specified in 'AnyFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[any]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }
            return this.values.map(m => m.trim()).join(',');
        }
    }
    Filters.AnyFilter = AnyFilter;
    class ContainsFilter {
        constructor(element, values) {
            this.element = element;
            this.values = values;
            if (!this.element) {
                throw Error(`Element specified in 'ContainsFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[contains]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }
            return this.values.map(m => m.trim()).join(',');
        }
    }
    Filters.ContainsFilter = ContainsFilter;
    class GreaterThanFilter {
        constructor(element, value) {
            this.element = element;
            this.value = value;
            if (!this.element) {
                throw Error(`Element specified in 'GreaterThanFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[gt]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.value) {
                return defaultValue;
            }
            return this.value;
        }
    }
    Filters.GreaterThanFilter = GreaterThanFilter;
    class GreaterThanOrEqualFilter {
        constructor(element, value) {
            this.element = element;
            this.value = value;
            if (!this.element) {
                throw Error(`Element specified in 'GreaterThanOrEqualFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[gte]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.value) {
                return defaultValue;
            }
            return this.value;
        }
    }
    Filters.GreaterThanOrEqualFilter = GreaterThanOrEqualFilter;
    class InFilter {
        constructor(element, values) {
            this.element = element;
            this.values = values;
            if (!this.element) {
                throw Error(`Element specified in 'Infilter' is undefined`);
            }
        }
        getParam() {
            return `${this.element.trim()}[in]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }
            return this.values.map(m => {
                return m.trim();
            }).join(',');
        }
    }
    Filters.InFilter = InFilter;
    class NotInFilter {
        constructor(element, values) {
            this.element = element;
            this.values = values;
            if (!this.element) {
                throw Error(`Element specified in 'NotInFilter' is undefined`);
            }
        }
        getParam() {
            return `${this.element.trim()}[nin]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.values || !Array.isArray(this.values)) {
                return defaultValue;
            }
            return this.values.map(m => {
                return m.trim();
            }).join(',');
        }
    }
    Filters.NotInFilter = NotInFilter;
    class LessThanFilter {
        constructor(element, value) {
            this.element = element;
            this.value = value;
            if (!this.element) {
                throw Error(`Element specified in 'LessThanFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[lt]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.value) {
                return defaultValue;
            }
            return this.value;
        }
    }
    Filters.LessThanFilter = LessThanFilter;
    class LessThanOrEqualFilter {
        constructor(element, value) {
            this.element = element;
            this.value = value;
            if (!this.element) {
                throw Error(`Element specified in 'LessThanOrEqualFilter' is undefined `);
            }
        }
        getParam() {
            return `${this.element.trim()}[lte]=${this.getParamValue()}`;
        }
        getParamValue() {
            if (!this.value) {
                return defaultValue;
            }
            return this.value;
        }
    }
    Filters.LessThanOrEqualFilter = LessThanOrEqualFilter;
    class RangeFilter {
        constructor(element, lowerValue, higherValue) {
            this.element = element;
            this.lowerValue = lowerValue;
            this.higherValue = higherValue;
            if (!this.element) {
                throw Error(`Element specified in 'RangeFilter' is undefined `);
            }
            if (lowerValue > higherValue) {
                throw Error(`'lowerValue' cannot be higher then 'higherValue' in 'RangeFilter'`);
            }
        }
        getParam() {
            return `${this.element.trim()}[range]=${this.getParamValue()}`;
        }
        getParamValue() {
            let lowerVal = defaultValue;
            let higherVal = defaultValue;
            if (this.lowerValue) {
                lowerVal = this.lowerValue.toString();
            }
            if (this.higherValue) {
                higherVal = this.higherValue.toString();
            }
            return `${lowerVal},${higherVal}`;
        }
    }
    Filters.RangeFilter = RangeFilter;
})(Filters || (Filters = {}));
//# sourceMappingURL=filters.js.map