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

// !------------

// config/build/buildResolvers.ts
import { ResolveOptions } from 'webpack';
import { BuildOptions } from './types/config';

export function buildResolvers(options: BuildOptions): ResolveOptions {
    return {
        extensions: ['.tsx', '.ts', '.js'],
        preferAbsolute: true,
        modules: [options.paths.src, 'node_modules'],
        mainFiles: ['index'],
        alias: {
            '@': options.paths.src,
            'app': path.resolve(options.paths.src, 'app'),
            'shared': path.resolve(options.paths.src, 'shared'),
            'entities': path.resolve(options.paths.src, 'entities'),
            'features': path.resolve(options.paths.src, 'features'),
            'widgets': path.resolve(options.paths.src, 'widgets'),
            'pages': path.resolve(options.paths.src, 'pages')
        }
    };
}

// config/build/types/config.ts
export interface BuildPaths {
    entry: string;
    build: string;
    html: string;
    src: string;
}

export interface BuildEnv {
    mode: 'production' | 'development';
    port: number;
}

export interface BuildOptions {
    mode: 'production' | 'development';
    paths: BuildPaths;
    isDev: boolean;
    port: number;
}

// config/build/buildWebpackConfig.ts
import webpack from 'webpack';
import { BuildOptions } from './types/config';
import { buildPlugins } from './buildPlugins';
import { buildLoaders } from './buildLoaders';
import { buildResolvers } from './buildResolvers';
import { buildDevServer } from './buildDevServer';

export function buildWebpackConfig(options: BuildOptions): webpack.Configuration {
    const { mode, paths, isDev } = options;

    return {
        mode,
        entry: paths.entry,
        output: {
            filename: '[name].[contenthash].js',
            path: paths.build,
            clean: true,
            publicPath: '/'
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options)
        },
        resolve: buildResolvers(options),
        devtool: isDev ? 'inline-source-map' : undefined,
        devServer: isDev ? buildDevServer(options) : undefined
    };
}