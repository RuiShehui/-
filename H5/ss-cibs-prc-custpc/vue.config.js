const {
  resolve
} = require('path');
const {
  cdn,
  externals,
  target
} = require('./cdn-config');

// const MockServer = require("@v2-lib/mock.server.plugin");
const isProduction = process.env.NODE_ENV === 'production';

// console.log(serve);
module.exports = {
  lintOnSave: false,
  publicPath: isProduction ? '././' : './',
  outputDir: 'webbank',

  devServer: {
    port: 8048,
    disableHostCheck: true,
    hot: true,
    // open: true,
    proxy: {
      '/cibs/': {
        //个人网银 dev proxy
        target: target.YANSHI,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/cibs/sit/custpc/': '/cibs/custpc/'
        }
      }
    },
    after(app, server, compiler) {}
  },
  configureWebpack: config => {
    const plugins = [];
    if (isProduction) {
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
            minChunks: 1,
            chunks: 'all',
            enforce: true,
            priority: 60,
          },
          runtimeChunk: {
            name: 'manifest',
          }
        }
      }
    }
    /** ignore-externals when building */
    config.externals = externals;

    return {
      plugins
    };
  },

  transpileDependencies: ['webpack-dev-server/client/clients/SockJSClient.js'],
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@bank-transfer', resolve('src/views/bankTransfer')) // 转账汇款
      .set('@auth', resolve('src/views/authorizeCenter')) // 授权中心

    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.module.rule('compile')
      .test(/\.js$/)
      .include
      .add(resolve(__dirname, 'node_modules/@v2-lib'))
      .add(resolve(__dirname, 'node_modules/element-ui/src/utils/dom.js'))
      .add(resolve(__dirname, 'node_modules/@v2-pipe'))
      .add(resolve(__dirname, 'node_modules/@v2-components'))
      .add(resolve(__dirname, 'node_modules/element-ui/src/utils/resize-event.js'))

      .end()
      .use('babel')
      .loader('babel-loader')
      .options({
        presets: [
          ['@babel/preset-env', {
            modules: false
          }]
        ]
      });

    config.plugin('html').tap((args) => {
      if (isProduction) {
        args[0].cdn = cdn.build;
      } else {
        args[0].cdn = cdn.dev;
      }
      return args;
    });

    // if (!(process.argv.includes('--target') && process.argv.includes('lib'))) {
    //   config.module
    //     .rule('import-rule')
    //     .test(/_spa_import\.js/g)
    //     .use(path.resolve(__dirname, './node_modules/@v2-lib/vue.spa.plugin/loaders/import_loader.js'))
    //     .loader(path.resolve(__dirname, './node_modules/@v2-lib/vue.spa.plugin/loaders/import_loader.js'))
    //     .end()
    // }

  },
  productionSourceMap: false,
  filenameHashing: isProduction,
  css: {
    modules: false,
    extract: process.argv.includes('--component'),
    sourceMap: false,
    loaderOptions: {
      sass: {
        // 向全局sass样式传入共享的全局变量
        data: '@import "./src/scss/element-variables.scss";@import "./src/scss/project-variables.scss";'
      }
    }
  }
}
