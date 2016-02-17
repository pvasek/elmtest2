var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    debug: true,
    devtool: 'source-map',
    entry: {
        app: ['./main.tsx', './stylesheets/styles.js']
    },
    output: {
        path: path.join(__dirname, './dist'),
        publicPath: '/dist',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.css', '.less']
    },
    plugins: [
        new ExtractTextPlugin("[name].css")
    ],
    module: {
        loaders: [
            { test: /\.(tsx?)$/, loader: 'ts-loader?configFileName=../../tsconfig.json' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
            { test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader') },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },

            // needed for the bootstrap fonts/resources - source: https://github.com/bline/bootstrap-webpack
            { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
        ]
    }
};
