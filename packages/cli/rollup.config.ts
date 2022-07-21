import fse from '@dite/utils/compiled/fs-extra';
import path from 'path';
import { defineConfig } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';

const pkg = fse.readJSONSync(path.join(__dirname, 'package.json'));

const external = Object.keys(pkg.dependencies).concat([
  'path',
  'fs',
  'typescript',
]);

export default defineConfig({
  input: 'src/index.ts',
  plugins: [
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: false, // by default inferred from rollup's `output.sourcemap` option
      minify: true,
      target: 'es2017', // default, or 'es20XX', 'esnext'
      jsx: 'transform', // default, or 'preserve'
      define: {
        __VERSION__: '"x.y.z"',
      },
      tsconfig: 'tsconfig.json', // default
      // Add extra loaders
      loaders: {
        '.json': 'json',
        '.js': 'jsx',
      },
    }),
    // typescript({
    //   sourceMap: false,
    //   // tsconfig: path.resolve(__dirname, './tsconfig.json'),
    // })
  ],
  external,
  output: [
    {
      banner: '#!/usr/bin/env node\n',
      format: 'cjs',
      file: pkg.main,
      exports: 'auto',
    },
    // { format: 'esm', file: pkg.module },
  ],
});
