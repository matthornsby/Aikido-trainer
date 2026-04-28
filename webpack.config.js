const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const assetVersion = Date.now().toString(36);

  return {
    entry: './js/app.js',
    output: {
      path: path.resolve(__dirname),
      filename: isProd ? 'js/bundle.[contenthash:8].js' : 'js/bundle.js',
      assetModuleFilename: 'img/[name][ext]',
      clean: false,
    },
    mode: argv.mode || 'development',
    devtool: isProd ? false : 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                additionalData: `$sprite-cache-bust: "${assetVersion}";`,
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? 'css/style.[contenthash:8].css' : 'css/style.css',
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './index.html',
        inject: 'body',
      }),
    ],
  };
};
