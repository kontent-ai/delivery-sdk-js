import { camelCasePropertyNameResolver, pascalCasePropertyNameResolver, snakeCasePropertyNameResolver } from '../../../../lib';
import { Context, setup } from '../../setup';

interface INameValue {
    name: string;
    camelCase: string;
    pascalCase: string;
    snakeCase: string;
}

describe('Property name resolvers', () => {
    const nameValues: INameValue[] = [{
        name: 'test value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: ';test;value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: ',test,value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '_test value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: 'test / value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: ':test value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '%test%value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '?test?value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '-test-value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '!test!value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '§test§value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '\'test\'value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '"test"value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '=test=value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '&test&value',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '%test%value%',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '  test   value  ',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: '  test   value  ',
        camelCase: 'testValue',
        pascalCase: 'TestValue',
        snakeCase: 'test_value'
    },
    {
        name: 'zAPI Security scheme',
        camelCase: 'zAPISecurityScheme',
        pascalCase: 'ZAPISecurityScheme',
        snakeCase: 'zapi_security_scheme'
    },
    {
        name: 'zAPI ​Category', // text includes zero width character
        camelCase: 'zAPICategory',
        pascalCase: 'ZAPICategory',
        snakeCase: 'zapi_category'
    },
    {
        name: '404 Not found', // text starts with number
        camelCase: '_404NotFound',
        pascalCase: '_404NotFound',
        snakeCase: '_404_not_found'
    },
    {
        name: 'Home (root)',
        camelCase: 'homeRoot',
        pascalCase: 'HomeRoot',
        snakeCase: 'home_root'
    },
  ];

    const context = new Context();

    setup(context);

    describe('Camel case resolver', () => {
        it(`Values are converted`, () => {
            for (const nameValue of nameValues) {
                const converted = camelCasePropertyNameResolver('', nameValue.name);
                expect(converted).toEqual(nameValue.camelCase);
            }
        });
    });

    describe('Pascal case resolver', () => {
        it(`Values are converted`, () => {
            for (const nameValue of nameValues) {
                const converted = pascalCasePropertyNameResolver('', nameValue.name);
                expect(converted).toEqual(nameValue.pascalCase);
            }
        });
    });

    describe('Snake case resolver', () => {
        it(`Values are converted`, () => {
            for (const nameValue of nameValues) {
                const converted = snakeCasePropertyNameResolver('', nameValue.name);
                expect(converted).toEqual(nameValue.snakeCase);
            }
        });
    });
});
