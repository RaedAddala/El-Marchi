const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = env => {
  const isProd = env['node-env'] === 'production';
  console.log(env);
  console.log(isProd);
  // const optimization = isProd ? {
  //   minimize: true,
  //   moduleIds: 'deterministic',
  //   splitChunks: {
  //     chunks: 'all',
  //     minSize: 20000,
  //     minChunks: 1,
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10,
  //       },
  //       default: {
  //         minChunks: 2,
  //         priority: -20,
  //         reuseExistingChunk: true,
  //       },
  //     },
  //   }
  // } : false;
  // console.log(optimization);

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
        compiler: 'swc',
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
