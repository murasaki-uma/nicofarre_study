const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const poststylus = require('poststylus');
const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//node_modules\.bin\webpack-dev-server --port 3000 --hot --host 0.0.0.0
// .\node_modules\.bin\webpack
module.exports = {

    entry: './src/js/main.js',
    output: {

        path: `${__dirname}/docs`,
        // 出力ファイル名
        filename: 'assets/js/main.js'
    },

    plugins: [

        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/pug/index.pug',  // この行を変更
            inject: true
        }),

    ],
    module: {
        rules: [
            {
                // 拡張子 .ts の場合
                test: /\.ts$/,
                // TypeScript をコンパイルする
                use: 'awesome-typescript-loader'
            },
            // ソースマップファイルの処理
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.pug$/,
                loader: ['raw-loader', 'pug-html-loader']
            },
            {
                // Stylusファイル用の処理
                test: /\.(css|sass|styl)/,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader", "stylus-loader"]
                })
            },
            {
                test: /\.(jpg|png|gif|svg|)$/,
                loader: ['url-loader']
            },
            {
                test: /\.(glsl|vs|fs|frag|vert)$/,
                loader: 'shader-loader'
            },
            {
                test: /\.less$/,
                loader: ['style-loader', 'css-loader', 'less-loader'],
                exclude: /node_modules/
            },

            {
                // 拡張子 .js の場合
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ["transform-class-properties"],

                    }
                }

            },
        ]
    },
    // import 文で .ts ファイルを解決するため
    resolve: {
        extensions: [
            '.ts', '.js', '.json', '.pug', '.styl', '.glsl', '.frag', '.vert'
        ],
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'docs'),
        port: 3000,
        host: "0.0.0.0"
    },
    // ソースマップを有効に
    // devtool: 'source-map'
};