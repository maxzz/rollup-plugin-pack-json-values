import type { FilterPattern } from '@rollup/pluginutils';
import type { Plugin } from 'rollup';

export type PackcoruscantOptions = {
    /**
     * A picomatch pattern, or array of patterns, of files that should be
     * processed by this plugin (if omitted, all files are included by default)
     */
    include?: FilterPattern;
    /**
     * Files that should be excluded, if `include` is otherwise too permissive.
     */
    exclude?: FilterPattern;
    /**
     * Variable name like 'const coruscant = ' that ends with ';'
     */
    varName: string;
    /**
     * Don't show file name pattern match message.
     */
    silent?: boolean;
};
