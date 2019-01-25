'use strict'

const webpack = require('webpack')
const path = require('path')

var HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = {
    entry: './src/index.ts',

    mode: 'development',

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'project.bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: {
                            configFile: './tslint.json',
                        },
                    },
                ],
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },

    plugins: [
        new HardSourceWebpackPlugin(),
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true),
        }),
    ],
}
