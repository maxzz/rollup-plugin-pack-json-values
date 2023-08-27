import { createFilter } from '@rollup/pluginutils';
import JSON5 from 'json5';

function packJsonValues(txt, varName) {
    const pattern = `^[\r?\n]*(\\s*)${varName}(\\{[^;]*\\});`;
    const re = new RegExp(pattern, 'm');
    let found = false;
    const newTxt = txt.replace(re, (match, indent1, valuesStr) => {
        found = true;
        const objJson5 = JSON5.parse(`${valuesStr}`);
        const objWPackedValuesStr = JSON.stringify(Object.fromEntries(Object.entries(objJson5)
            .map(([key, value]) => [key, quoPck(JSON.stringify(value))])));
        const commentedLines = `${indent1}${valuesStr}`
            .split(/\r?\n/)
            .map((line) => !line.trimStart() ? '' : `${indent1}// ${line.replace(/^    /, '')}`)
            .filter(Boolean)
            .join('\n');
        return `\n${indent1}${varName}${objWPackedValuesStr};\n${commentedLines}\n`;
    });
    return found ? newTxt : null;
    function quoPck(src) {
        // 0. If has single quotas return as it is, otherwise replace " to ' and add {~} as prefix.
        return /'/.test(src) ? src : `{~}${src.replace(/"/g, '\'')}`;
    }
    /*
    function quoUnp(src: string): string {
        // 0 Unpack quotas: remove {~} prefix and return back double quotas.
        return /^{~}/.test(src) ? src.slice(3).replace(/'/g, '"') : src;
    }
    */
}

function green(text) {
    return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m';
}
function replace(options) {
    options = options || {};
    const filter = createFilter(options.include, options.exclude);
    return {
        name: 'pack-json-values',
        transform(code, id) {
            if (!filter(id)) {
                return null;
            }
            if (!options.silent) {
                console.log(green(`\npack-json-values for:\n${id}\n`));
            }
            if (!options.varName) {
                this.error('Specify a variable name to pack values from.');
            }
            let newCode = packJsonValues(code, options.varName);
            if (!newCode) {
                this.error(`Cannot find variable '${options.varName}' that ends with ';'`);
                return null;
            }
            return { code: newCode };
        }
    };
}

export { replace as default };
//# sourceMappingURL=index.js.map
