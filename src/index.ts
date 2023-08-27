import type { TransformPluginContext, TransformResult } from 'rollup';
import { createFilter } from '@rollup/pluginutils';
import { PackcoruscantOptions } from '../types';
import { packJsonValues } from './pack-json-values';

function green(text: string) {
    return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m';
}

export default function replace(options: PackcoruscantOptions) {
    options = options || {};

    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'pack-json-values',

        transform(this: TransformPluginContext, code: string, id: string): TransformResult {

            if (!filter(id)) {
                return null;
            }

            if (!options.silent) {
                console.log(green(`\npack-json-values for:\n${id}\n`));
            }

            if (!options.varName) {
                this.error('Specify a variable name to pack values from.');
            }

            let newCode: string | null = packJsonValues(code, options.varName);

            if (!newCode) {
                this.error(`Cannot find variable '${options.varName}' that ends with ';'`);
                return null;
            }

            return { code: newCode };
        }
    };
}
