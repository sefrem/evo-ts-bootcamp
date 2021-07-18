const path = require('path');
const nodeExternals = require('webpack-node-externals');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
    entry: './src/types.ts',
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    externals: [nodeExternals()],
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
