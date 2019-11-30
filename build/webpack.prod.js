const merge = require('webpack-merge');
const webpack = require('webpack');
const chalk = require('chalk');
const webpackBase = require('./webpack.base');

const webpackProdConf = merge(webpackBase, {
  mode: 'production'
});

webpack(webpackProdConf, (err, stats) => {
  if (err) throw err;

  if (stats.hasErrors()) {
    console.log(chalk.red('build fail'))
    process.exit(1)
  }
  console.log(chalk.green('build success'))
});