import webpack from 'webpack';
import path from 'path';
import { buildWebpackConfig } from './config/build/buildWebpackConfig';
import { BuildEnv, BuildPaths } from './config/build/types/config';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default (env: BuildEnv) => {
    const paths: BuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        build: path.resolve(__dirname, 'build'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        src: path.resolve(__dirname, 'src'),
    };

    const mode = env.mode || 'development';
    const PORT = env.port || 3000;
    const isDev = mode === 'development';

    const config: webpack.Configuration = {
        mode,
        entry: paths.entry,
        output: {
            filename: '[name].[contenthash].js',
            path: paths.build,
            clean: true,
            publicPath: '/',
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    auto: (resPath: string) => Boolean(resPath.includes('.module.')),
                                    localIdentName: isDev
                                        ? '[path][name]__[local]--[hash:base64:5]'
                                        : '[hash:base64:8]',
                                },
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                __IS_DEV__: JSON.stringify(isDev),
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css',
            }),
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.jsx'],
            preferAbsolute: true,
            modules: [paths.src, 'node_modules'],
            mainFiles: ['index'],
            alias: {
                '@': paths.src,
                'app': path.resolve(__dirname, 'src/app'),
                'shared': path.resolve(__dirname, 'src/shared'),
                'entities': path.resolve(__dirname, 'src/entities'),
                'features': path.resolve(__dirname, 'src/features'),
                'widgets': path.resolve(__dirname, 'src/widgets'),
                'pages': path.resolve(__dirname, 'src/pages'),
            },
        },
        devServer: {
            port: PORT,
            open: true,
            historyApiFallback: true,
            hot: true,
        },
    };

    return config;
};