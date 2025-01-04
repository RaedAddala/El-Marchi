const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

// const isProd = process.env.NODE_ENV === 'production';
// nx doesn't apply
const isProd = false;
console.log(process.env);

module.exports = {
  target: 'node',
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'source-map' : 'eval-source-map',

  output: {
    path: join(__dirname, './dist/el-marchi-api'),
    filename: 'main.js',
    clean: true,
  },

  optimization: {
    minimize: isProd,
    moduleIds: 'deterministic',
    splitChunks: isProd ? {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    } : false,
  },

  externals: [nodeExternals()],

  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'swc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing:  'none',
      generatePackageJson: true,
      sourceMap: true,
    }),
  ],

  experiments: {
    topLevelAwait: true,
  },
};
