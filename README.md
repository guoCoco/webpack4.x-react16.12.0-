# 从零开始搭建一个React（v16.12.0） + webpack(v4.x)的项目  

默认安装了node环境。

## 初始化项目目录

- 在命令行中执行  
```
mkdir react-practice
cd react-practice
npm init -y
```
- 在 react-practice下创建webpack.config.js文件
```
// windows系统命令
type null>webpack.config.js
```

## 构建项目目录及安装react react-dom
```
  webpack-practice
  |- package.json
+ |- index.html
+ |- /src
+   |- index.js
```
```
npm install -S react react-dom
```

## 安装
```
npm install -D webpack webpack-cli
```
修改package.json 中 配置 scripts
```
"scripts": {
  "start": "webpack --config webpack.config.js"
},
```
--config 后面指定的是配置文件，默认文件是 webpack.config.js，使用默认文件可以省略，如果是其他文件名必须使用--config指定文件

## 配置webpack 
- webpack.config.js
```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {      
    app: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  }
}
```
在 src/index.js中输入一下js代码， 执行npm start , 可以看到 根目录下生成了一个dist目录，目录下有个app.js

## 打包后自动生成html文件  
我们需要使用一个插件 html-webpack-plugin
```
npm install -D html-webpack-plugin
```
在 webpack.config.js中添加 
```
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
+  plugins: [
+    new HtmlWebpackPlugin({
+      title: 'react-practice',
+      filename: 'index.html',
+      template: 'index.html'
+    })
+  ]
}
```
删除刚刚生成的dist目录，再次执行 npm start ，dist目录下比之前多了一个index.html，这个时候需要手动删除dist，我们使用一个插件
clean-webpack-plugin，每次打包前删除上一次生成的dist目录 ,在 webpack.config.js中添加
```
+ const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
 
 plugins: [
+     new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'react-practice',
        filename: 'index.html',
        template: 'index.html'
      })
  ]
}
```

## 添加 对react 代码转译配置  
react代码 我们需要babel转译，配置一下babel，我们使用最新的bable 7.x版本，并且（从版本7开始）都是以@babel作为冠名的，下载相关npm包
```
npm install -D babel-loader @babel/cli @babel/core @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime @babel/preset-env @babel/preset-react babel-plugin-import   
npm install -S @babel/polyfill core-js@3
```
在根目录下创建一个 .babelrc文件，添加内容：
```
{
  "plugins": [
    ["@babel/plugin-transform-runtime"],
    ["@babel/plugin-proposal-class-properties"]
  ],
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "corejs": "3",
        "useBuiltIns": "usage"
      }
    ],
    "@babel/preset-react"
  ]
}
```
- 在webpack.config.js中添加如下配置：  
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader']
      }
    ]
}
}
```
- 在/src/index.js中添加
```
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    return (
      <div>hello world</div>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
```
- 在index.html中添加： 
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```    
babel配置完成，执行 npm start 生成了dist目录，打开dist下的index.hmtl文件  
每次修改我们的文件，都要打包，这个效率不高，我们来配置下开发时，使用的配置

## 使用webpack-dev-server  
```
npm install -D webpack-dev-server
```
- webpack.config.js 添加配置  
```
module.exports = {
+  devServer: {
+    contentBase: './dist'
+  }
}
```
- package.json 添加scripts 命令  
```
"scripts": {
    "start": "webpack --config webpack.config.js"
    "dev": "webpack-dev-server --watch --inline --open --config webpack.config.js"
  },
```


## 区分环境  
现在将所有的配置都在webpack.config.js中配置，后面会添加很多配置，会导致这个文件很多，这个时候，我们按照不同环境配置下  
```
  webpack-practice
+ |- /build
+   |- webpack.base.js
+   |- webpack.dev.js
+   |- webpack.prod.js
```
按照一个工具 webpack-merge,用于合并配置
```
npm install -D webpack-merge
```
- webpack.base.js 添加配置
```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {      
    app: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
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
    })
  ]
}
```  
- webpack.dev.js  
```
const merge = require('webpack-merge');
const path = require('path');
const webpackBase = require('./webpack.base');

module.exports = merge(webpackBase, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  }
})
```
- webpack.prod.js  下载个chalk模块  npm install -D chalk
```
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
```  
删除 webpack.config.js
- packagek.json scripts 配置 
```
 "scripts": {
    "dev": "webpack-dev-server --watch --inline --open --config build/webpack.dev.js",
    "build": "node build/webpack.prod.js"
  },
```

## css配置与抽离  
我们在react中准备使用sass及分离到单独的文件中，我们使用mini-css-extract-plugin这个插件分离css  
```
npm install -D mini-css-extract-plugin css-loader postcss-loader sass-loader node-sass autoprefixer
``` 
注意我们没有下载style-loader，style-loader的作用是将css通过style标签内联到html中，我们是将css抽离到单独文件所以不需要，
npm下载node-sass如果出现下载不下来，使用cnpm。 
- 在 webpack.base.js 增加配置如下：  
```
+ const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry: {      
    app: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      ...
+     {
+       test: /\.(css|scss)$/,
+       use: [
+         {
+           loader: MiniCssExtractPlugin.loader,
+           options: {
+             publicPath:'../',
+             hmr: process.env.NODE_ENV === 'development'
+           }
+         },
+         'css-loader',
+         'postcss-loader',
+         'sass-loader'
+       ]
+     }
    ]
  },
  plugins: [
    ...
+   new MiniCssExtractPlugin({
+     filename: 'css/[name][contenthash].css',
+     chunkFilename: 'css/[id][contenthash].css',
+     ignoreOrder: false
+   })
  ],
}
```
css新的属性我们还有自动添加前缀，我们使用postcss,在根目录下创建一个postcss.config.js添加如下配置：  
```
module.exports = {
  plugins:[
      require("autoprefixer")
  ]
}
```  
这个时候就可以使用scss，编写css样式，引入我们的jsx中啦。。。


##  加载图片  
这里我们需要用到连个loader,url-loader file-loader.我们使用url-loader配置，有个limit选项可以设置一个图片大小，大于这个值，url-loader会自动交给file-loader处理，下面下载一下  
```
npm install --save-dev file-loader url-loader
```
- 在 webpack.base.js中配置下  
```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {      
    app: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      ...
+     {
+       test: /\.(png|jpg|gif)$/,
+       use: [
+         {
+           loader: 'url-loader',
+           options: {
+             limit: 5000,
+             name: 'images/[hash].[ext]'
+           }
+         }
+       ]
+     }
    ]
  }
  ...
}
```  

## 代码抽离  
前置知识：  
webpack在打包后的代码，大概分为三类：  
1. 我们自己编写的业务代码 
2. 第三方库代码，如：react vue 等。
3. webpack管理各个模块交互的代码   
现在我们打包后所有的代码都在一个js文件中，下面我们配置下，将这三部分代码分离出来  
```
...

module.exports = {
  ...
+ optimization: {
+   splitChunks: {
+     chunks: "async",
+     minSize: 30000,
+     minChunks: 1,
+     maxAsyncRequests: 5,
+     maxInitialRequests: 3,
+     automaticNameDelimiter: '~',
+     name: true,
+     cacheGroups: {
+       commons: {
+           test: /[\\/]node_modules[\\/]/,
+           name: 'vendors',
+           chunks: 'all'
+       }
+     }
+   },
+   runtimeChunk: {
+     name: 'manifest'
+   }
+ }
}
```  
*备注： 在webpack4.x版本之前使用的都是CommonsChunkPlugin插件对代码进行分割，webpack4把CommonsChunkPlugin移除了。使用的SplitChunksPlugin对代码分割*


## 配置开发跨域配置  
在本地开发过程中，和后台交互的时候，在不同的ip地址，就会出现跨域的情况。我们配置下devServer，实现前端代理。  
- 在 webpack.dev.js  添加  
```
const merge = require('webpack-merge');
const path = require('path');
const webpackBase = require('./webpack.base');

module.exports = merge(webpackBase, {
  mode: 'development',
  devServer: {
    ...
+   proxy: {
+     '/api': {
+       target: 'http://10.25.11.20:8080', // 后台接口地址
+       ws: true,
+       changeOrigin: true,
+       pathRewrite: {
+         '^/api': ''
+       }
+     }
+   }
  }
})
```  

## ouput输出配置补充  
我们在配置output.filename  output.chunkFilename的时候,使用的是[name].js 在dist目录下可以看到每次打包后的文件名都是一样的，当我们前端静态资源放到服务器上，因为文件名不变，可能会导致客户请求访问的是缓存的js 文件，这个时候可能要手动清理浏览器缓存，我们其实可以通过配置 output保证每次更新文件名  
- 在webpack.base.js中添加  
```
  ...
  output: {
    path: path.resolve(__dirname, '../dist'),
  -  filename: "js/[name].js",
  -  chunkFilename: "js/[name].js"
  +  filename: "js/[name][chunkhash].js",
  +  chunkFilename: "js/[name][chunkhash].js"
  },
  ...
```
解释下，为什么使用chunkhash，这个值是通过文件进行hash计算得到的20位字符串，如果文件不变这个值就是唯一的，文件修改了会生成一个新的hash,这个时候就可以保证每次文件修改会生成新的文件。

## webpack一些常用的插件配置补充  
- 比如我们在项目中想用一些工具库比如 jquery，d3等，在项目中不想每个文件夹都import，想使用一个全局的，我们需要用到ProvidePlugin，配置如下：  
```
const path = require("path");
+ const webpack = require('webpack');
...

module.exports = {
  ...
  plugins: [
    ...
+   new webpack.ProvidePlugin({
+     $: 'jquery',
+     jQuery: 'jquery',
+     d3: 'd3'
+   })
  ],
}
```
- DefinePlugin
  DefinePlugin 允许创建一个在编译时可以配置的全局常量,就是在webpack中配置的变量，可以在我们的项目代码中可以访问。  
```
...
  plugins: [
    ...
+   new webpack.DefinePlugin({
+     str: JSON.stringify("5fa3b9"),
+     str1: "'http://10.23.4.5'",
+     add: "1+1",
+     'myObj.a': {a: 1, b:2}
+   })
  ]
```
*注意：如果传递的变量值是字符串，需要使用JSON.stringify(),如配置所示，因为字符串被当做代码片段处理，如果key值是用.连接起来需要使用字符串形式*


**关注公众号，获取更多精彩内容**
