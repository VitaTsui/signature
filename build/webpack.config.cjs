const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'
const pkg = require('../package.json')

const config = {
  mode: devMode ? 'development' : 'production',
  entry: ['./index.js'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: devMode ? 'signature.js' : 'signature.min.js',
    globalObject: 'this',
    library: 'signature',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, './tsconfig/tsconfig.json')
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader','postcss-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {}
  },
  plugins: [
    // 主要用于对打包好的js文件的最开始处添加版权声明
    new webpack.BannerPlugin(
      `\nsignature v${pkg.version} \n\n${pkg.description} \n\n${fs.readFileSync(path.join(process.cwd(), 'LICENSE'))}`
    ),
    // 将CSS提取到单独的文件中
    new MiniCssExtractPlugin({
      filename: devMode ? 'signature.css' : 'signature.min.css',
      chunkFilename: '[id].css'
    })
  ],
  optimization: {
    minimizer: devMode
      ? []
      : [
          // 压缩js代码
          // webpack v5 使用内置的TerserJSPlugin替代UglifyJsPlugin，因为UglifyJsPlugin不支持ES6
          new TerserJSPlugin({
            parallel: true // 使用多进程并行运行
          }),
          // 用于优化或者压缩CSS资源
          new CssMinimizerPlugin({
            parallel: true
          })
        ]
  }
}

module.exports = config