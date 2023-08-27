import JSON5 from 'json5';

export function packJsonValues(txt: string, varName: string): string | null {

    const pattern = `^[\r?\n]*(\\s*)${varName}(\\{[^;]*\\});`;
    const re = new RegExp(pattern, 'm');
    let found = false;

    const newTxt = txt.replace(re, (match, indent1, valuesStr) => {
        found = true;

        const objJson5 = JSON5.parse(`${valuesStr}`);

        const objWPackedValuesStr = JSON.stringify(
            Object.fromEntries(
                Object.entries(objJson5)
                    .map(([key, value]) => [key, quoPck(JSON.stringify(value))])
            )
        );

        const commentedLines = `${indent1}${valuesStr}`
            .split(/\r?\n/)
            .map((line: string) => !line.trimStart() ? '' : `${indent1}// ${line.replace(/^    /, '')}`)
            .filter(Boolean)
            .join('\n');

        return `\n${indent1}${varName}${objWPackedValuesStr};\n${commentedLines}\n`;
    });

    return found ? newTxt : null;

    function quoPck(src: string) {
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
