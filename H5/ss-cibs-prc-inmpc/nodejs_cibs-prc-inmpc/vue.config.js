/*
 * @Author: ZhangZhen
 * @Date: 2021-11-22 09:35:32
 * @LastEditTime: 2022-10-12 20:18:22
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\vue.config.js
 */

const {
  resolve
} = require('path');
// const config = require("./config/config.json")
// const chalk = require('chalk');

// const serve = config.serve;

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  lintOnSave: false,
  outputDir: '../build',
  // assetsDir: './static',
  publicPath: isProduction ? '././' : './', // '././'
  filenameHashing: isProduction,
  productionSourceMap: false,
  devServer: {
    port: 8048,
    disableHostCheck: true,
    hot: true,
    open: true,
    proxy: {
      '/cibs/inmpc': {
        target: 'http://192.168.67.51',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/cibs/inmpc': '/cibs'
        }
      }
    }
  },
  configureWebpack: config => {
    const plugins = [];
    // resolve: {
    //   alias: {
    //     // '@v2-lib/vue.spa.plugin': path.resolve(__dirname, './vue.spa.plugin')
    //   }
    // },
    if (isProduction) {
      /** prduction config */
      // config.externals = {
      //   "vue": "Vue",
      //   "vue-router": "VueRouter",
      //   "vuex": "Vuex",
      //   "axios": "axios",
      //   "element-ui": "ELEMENT"
      // };
      /**
       * 1. uglify code
       * 2. gzip file
       */
      const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
      // const CompressionWebpackPlugin = require('compression-webpack-plugin'); // nginx服务器配置gzip即可

      plugins.push(new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
          warnings: false,
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.warn', 'console.error'],
          }
        }
      }));
    }
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          // 第三方库提取
          vendor: {
            chunks: 'all',
            test: /node-modules/,
            name: 'vendor',
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100
          },
          // 公共模块提取
          common: {
            chunks: 'all',
            test: /[\\/]src[\\/]js[\\/]/,
            name: 'common',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 80
          },
          // 公共样式提取
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss$/,
            chunks: 'all',
            enforce: true,
            priority: 60,
          },
          runtimeChunk: {
            name: 'manifest',
          }
        }
      }
    };

    return {
      plugins
    };
  },

  transpileDependencies: ['webpack-dev-server/client/clients/SockJSClient.js'],

  chainWebpack: (config) => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.module.rule('compile')
      .test(/\.js$/)
      .include
      .add(resolve(__dirname, 'node_modules/@v2-lib'))
      .add(resolve(__dirname, 'node_modules/element-ui/src/utils/dom.js'))

      .end()
      .use('babel')
      .loader('babel-loader')
      .options({
        presets: [
          ['@babel/preset-env', {
            modules: false,
          }]
        ]
      });
  },
  // filenameHashing: false,
  css: {
    modules: false,
    extract: false, // 是否需要打包出css文件
    sourceMap: false,
    loaderOptions: {
      sass: {
        // 向全局sass样式传入共享的全局变量
        data: '@import "~@/scss/element-variables.scss";@import "~@/scss/project-variables.scss";'
      }
    }
  }
};
