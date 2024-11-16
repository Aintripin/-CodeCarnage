// import { ResolveOptions } from 'webpack';
// import { BuildOptions } from './types/config';
//
// export function buildResolvers(options: BuildOptions): ResolveOptions {
//     return {
//         extensions: ['.tsx', '.ts', '.js'],
//         preferAbsolute: true,
//         modules: [options.paths.src, 'node_modules'],
//         mainFiles: ['index'],
//         alias: {},
//     };
// }


import { ResolveOptions } from 'webpack';
import { BuildOptions } from './types/config';

export function buildResolvers(options: BuildOptions): ResolveOptions {
    return {
        extensions: ['.tsx', '.ts', '.js'],
        preferAbsolute: true,
        modules: [options.paths.src, 'node_modules'],
        mainFiles: ['index'],
        alias: {
            app: options.paths.src + '/app',
            entities: options.paths.src + '/entities',
            shared: options.paths.src + '/shared'
        },
    };
}
