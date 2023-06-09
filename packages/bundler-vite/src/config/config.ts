import Config from '@dite/bundler-vite/compiled/webpack-5-chain';
import path from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';
import { DEFAULT_DEVTOOL, DEFAULT_OUTPUT_PATH } from '../constants';
import { esbuildLoader } from '../loader/esbuild';
import { Env, IConfig } from '../types';
import { getBrowsersList } from '../utils/browsersList';
import { addSpeedMeasureWebpackPlugin } from './speedMeasureWebpackPlugin';

export interface IOpts {
  cwd: string;
  rootDir?: string;
  env: Env;
  entry: Record<string, string>;
  extraBabelPresets?: any[];
  extraBabelPlugins?: any[];
  extraBabelIncludes?: string[];
  extraEsbuildLoaderHandler?: any[];
  babelPreset?: any;
  chainWebpack?: Function;
  modifyWebpackConfig?: Function;
  hash?: boolean;
  hmr?: boolean;
  staticPathPrefix?: string;
  userConfig: IConfig;
  analyze?: any;
  name?: string;
  cache?: {
    absNodeModulesPath?: string;
    buildDependencies?: string[];
    cacheDirectory?: string;
  };
}

export async function getConfig(opts: IOpts) {
  const isDev = opts.env === Env.development;

  const { userConfig } = opts;
  const config = new Config();
  const useHash = !!(opts.hash || (userConfig.hash && !isDev));
  const applyOpts = {
    name: opts.name,
    config,
    userConfig,
    cwd: opts.cwd,
    env: opts.env,
    babelPreset: opts.babelPreset,
    extraBabelPlugins: opts.extraBabelPlugins || [],
    extraBabelPresets: opts.extraBabelPresets || [],
    extraBabelIncludes: opts.extraBabelIncludes || [],
    extraEsbuildLoaderHandler: opts.extraEsbuildLoaderHandler || [],
    browsers: getBrowsersList({
      targets: userConfig.targets || {},
    }),
    useHash,
    staticPathPrefix:
      opts.staticPathPrefix !== undefined ? opts.staticPathPrefix : 'static/',
  };
  console.log(applyOpts);
  // mode
  config.mode(opts.env);
  // config.mode('none')
  config.stats('none');
  config.node(false).node.set('__dirname', false).set('__filename', false);

  config.resolve.extensions.merge(['.tsx', '.ts', '.js']);
  config.resolve.plugin('TsconfigPathsPlugin').use(TsconfigPathsPlugin, [
    {
      configFile: 'tsconfig.build.json',
    },
  ]);
  // config.plugin('ForkTsCheckerWebpackPlugin').use(ForkTsCheckerWebpackPlugin, [{
  //   typescript: {
  //     configFile: 'tsconfig.build.json',
  //   },
  // }])
  config.optimization.set('nodeEnv', false);

  // entry
  // Object.keys(opts.entry).forEach((key) => {
  // const entry = config.entry(key)
  // if (isDev && opts.hmr) {
  //   entry.add(require.resolve('../../client/client/client'))
  // }
  // entry.add(opts.entry[key])
  // })
  // config.set('entry', path.join(opts.cwd, './api/main.ts'))
  config
    .entry('index')
    .add(path.join(opts.cwd, './api/main.ts'))
    .end()
    .output // .path('dist')
    .filename('[name].bundle.js');

  config.externals([webpackNodeExternals()]);
  config.externalsPresets({ node: true });

  // devtool
  config.devtool(
    isDev
      ? userConfig.devtool === false
        ? false
        : userConfig.devtool || DEFAULT_DEVTOOL
      : userConfig.devtool!,
  );
  config.ignoreWarnings([/^(?!CriticalDependenciesWarning$)/]);
  config.plugin('IgnorePlugin').use(webpack.IgnorePlugin, [
    {
      checkResource(resource: any) {
        const lazyImports = [
          '@nestjs/microservices',
          'cache-manager',
          'class-validator',
          'class-transformer',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource, {
            paths: [process.cwd()],
          });
        } catch (err) {
          return true;
        }
        return false;
      },
    },
  ]);

  config.module
    .rule('src')
    .test(/.(jsx|ts|tsx?)$/)
    // .resolve.set('fullySpecified', false)
    // .end()
    .include.add(opts.cwd)
    .end()
    .exclude.add(/node_modules/)
    .end()
    // .use('swc-loader')
    // .loader(require.resolve('../loader/swc'))
    // .options({
    //   // plugin: (m: Program) => new AutoCSSModule().visitProgram(m),
    // });
    .use('esbuild-loader')
    .loader(esbuildLoader)
    .options({
      target: isDev ? 'esnext' : 'es2015',
      handler: [],
      // handler: [autoCssModulesHandler, ...opts.extraEsbuildLoaderHandler],
    });

  // output
  const absOutputPath = path.join(
    opts.cwd,
    userConfig.outputPath || DEFAULT_OUTPUT_PATH,
  );
  console.log(absOutputPath);
  config.cache(true);

  // const disableCompress = process.env.COMPRESS === 'none'
  // config.output
  //   .path(absOutputPath)
  //   .filename(useHash ? `[name].[contenthash:8].js` : `[name].js`)
  //   .chunkFilename(
  //     useHash ? `[name].[contenthash:8].async.js` : `[name].async.js`,
  //   )
  //   .publicPath(userConfig.publicPath || 'auto')
  //   .pathinfo(isDev || disableCompress)

  // externals
  // config.externals(userConfig.externals || [])

  // cache
  if (opts.cache) {
    config.cache({
      type: 'filesystem',
      version: require('../../package.json').version,
      buildDependencies: {
        config: opts.cache.buildDependencies || [],
      },
      cacheDirectory:
        opts.cache.cacheDirectory ||
        // 使用 rootDir 是在有 APP_ROOT 时，把 cache 目录放在根目录下
        path.join(
          opts.rootDir || opts.cwd,
          'node_modules',
          '.cache',
          'bundler',
        ),
    });

    config.infrastructureLogging({
      level: 'error',
      ...(process.env.WEBPACK_FS_CACHE_DEBUG
        ? {
            debug: /webpack\.cache/,
          }
        : {}),
    });
  }

  // chain webpack
  if (opts.chainWebpack) {
    await opts.chainWebpack(config, {
      env: opts.env,
      webpack,
    });
  }

  if (userConfig.chainWebpack) {
    await userConfig.chainWebpack(config, {
      env: opts.env,
      webpack,
    });
  }

  // target
  config.target('node');
  // rules
  // await addJavaScriptRules(applyOpts)
  let webpackConfig = config.toConfig();
  // speed measure
  // TODO: mini-css-extract-plugin 报错
  webpackConfig = await addSpeedMeasureWebpackPlugin({
    webpackConfig,
  });

  return webpackConfig;
}
