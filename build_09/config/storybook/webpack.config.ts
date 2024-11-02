import webpack from "webpack";

export default ({ config }: {config: webpack.Configuration}) => {
    const paths: buildPaths = {
        build: '',
        html: '',
        entry: '',
        src: path.resolve(__dirname,  '..', '..' ,'src'),
    };
    config.resolve.modules.push(paths.src);
    config.resolve.extensions.push('.ts', '.tsx');

    return config;
}
