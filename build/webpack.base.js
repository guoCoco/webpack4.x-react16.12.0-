const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {      
    app: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "js/[name][chunkhash].js",
    chunkFilename: "js/[name][chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath:'../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              name: 'images/[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'react-practice',
      filename: 'index.html',
      template: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name][contenthash].css',
      chunkFilename: 'css/[id][contenthash].css',
      ignoreOrder: false
    }),
    new webpack.DefinePlugin({
      str: JSON.stringify("5fa3b9"),
      str1: "'http://10.23.4.5'",
      add: "1+1",
      'myObj.a': {a: 1, b:2}
    })
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   d3: 'd3'
    // })
  ],
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
}