import { fse } from '@dite/utils';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

const pkg = fse.readJSONSync(process.cwd(), './package.json');

const external = Object.keys(pkg.dependencies || {}).concat(
  Object.keys(pkg.peerDependencies || {}),
);

export default defineConfig({
  input: 'src/index.ts',
  external: [
    ...external,
    /dite\/dist/,
    /@dite\/[-\w]+\/compiled/,
    /node_modules/,
  ],
  output: [
    {
      format: 'cjs',
      dir: 'dist',
      preserveModules: true,
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
      exports: 'named',
    },
    {
      format: 'esm',
      dir: 'dist',
      preserveModules: true,
      entryFileNames: '[name].mjs',
      chunkFileNames: '[name].mjs',
      exports: 'named',
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    nodeResolve(),
  ],
});
