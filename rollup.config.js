import typescript from 'rollup-plugin-typescript';
import {terser} from "rollup-plugin-terser";

export default {
    input: 'src/index.ts',
    output: {
        file: './bundle.min.js',
        format: 'iife',
        name: 'MyPackage'
    },
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
        terser()
    ]
};