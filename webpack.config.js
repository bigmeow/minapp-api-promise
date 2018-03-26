const path = require('path');
const webpack = require('webpack');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: './src/wxp.js',
    output: {
        filename: 'wxp.min.js',
        path: __dirname + '/dist/',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: true,
    },
    plugins: [
        new UnminifiedWebpackPlugin({
            postfix: ''
        })
    ]
}