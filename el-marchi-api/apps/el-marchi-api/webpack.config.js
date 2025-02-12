const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = env => {
  const isProd = env['node-env'] === 'production';
  return {
    target: 'node',
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'eval-source-map',
    output: {
      path: join(__dirname, '../../dist/apps/el-marchi-api'),
      filename: 'main.js',
      clean: true,
    },
    externals: [nodeExternals()],
    plugins: [
      new NxAppWebpackPlugin({
        target: 'node',
        compiler: 'tsc',
        main: './src/main.ts',
        tsConfig: './tsconfig.app.json',
        assets: ['./src/assets'],
        optimization: isProd,
        outputHashing: 'none',
        generatePackageJson: true,
        sourceMap: true,
      }),
    ],
    experiments: {
      topLevelAwait: true,
    },
  };
};
