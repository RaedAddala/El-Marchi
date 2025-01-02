const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',

  output: {
    path: join(__dirname, './dist/el-marchi-api'),
    filename: '[name].js',
    clean: true
  },

  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },

  externals: [nodeExternals()],

  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'swc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: process.env.NODE_ENV === 'production',
      outputHashing: process.env.NODE_ENV === 'production' ? 'media' : 'none',
      generatePackageJson: true,
      sourceMap: true,
    })
  ],

  experiments: {
    topLevelAwait: true
  }
};
