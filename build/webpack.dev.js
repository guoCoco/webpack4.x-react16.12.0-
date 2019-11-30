const merge = require('webpack-merge');
const path = require('path');
const webpackBase = require('./webpack.base');

module.exports = merge(webpackBase, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://10.25.11.20:8080', // 后台接口地址
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})