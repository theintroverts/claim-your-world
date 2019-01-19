'use strict';

const webpack = require('webpack');
const path = require('path');

var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {

    entry: './src/index.js',

    mode: 'development',

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'project.bundle.js'
    },

    module: {
        rules: [
            {
                test: [ /\.vert$/, /\.frag$/ ],
                use: 'raw-loader'
            }
        ]
    },

    plugins: [
        new HardSourceWebpackPlugin(),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })
    ]

};
