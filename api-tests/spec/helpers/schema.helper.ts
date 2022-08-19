import {
    Schema,
    Validator,
} from 'jsonschema';
import {resolve} from 'path';
import {SchemaGenerator} from 'ts-json-schema-generator';

const tsconfig = (process.env.PROJECT_PATH)
    ? resolve(`${process.env.PROJECT_PATH}/../tsconfig.app.json`)
    : resolve('../tsconfig.engine.json');

const tjs = require('ts-json-schema-generator');

const globalGenerator: SchemaGenerator = tjs.createGenerator({
    tsconfig,
    additionalProperties: true,
});

beforeAll(() => {
    jasmine.addMatchers({
        toBeImplemented: () => {
            return {
                compare: (interfaceName: string, response: unknown) => {
                    const schema = globalGenerator.createSchema(interfaceName) as Schema;
                    const validateResult = new Validator().validate(response, schema);

                    if (process.env.API_DEBUG && validateResult.errors.length) {
                        // eslint-disable-next-line no-console
                        console.log(validateResult.errors);
                    }

                    return {
                        pass: !validateResult.errors.length,
                        message: !validateResult.errors.length
                            ? `Response implements ${interfaceName}`
                            : `Error validate response with ${interfaceName}.`
                            + ` ${validateResult.errors.length} errors found`,
                    };
                },
            };
        },
    });
});
