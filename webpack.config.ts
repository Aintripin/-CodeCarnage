import webpack from 'webpack';
import path from 'path';
import { buildWebpackConfig } from './config/build/buildWebpackConfig';
import { BuildEnv, BuildPaths, WebpackConfig } from './config/build/types/config';

export default (env: BuildEnv) => {
    const webpackPaths: BuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        build: path.resolve(__dirname, 'build'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        src: path.resolve(__dirname, 'src'),
    };

    const mode = env.mode || 'development';
    const PORT = env.port || 3000;

    const isDev = mode === 'development';

    const config: WebpackConfig = {
        ...buildWebpackConfig({
            mode,
            paths: webpackPaths,
            isDev,
            port: PORT,
        }),
        resolve: {
            modules: [webpackPaths.src, 'node_modules'],
        },
    };

    return config;
};
