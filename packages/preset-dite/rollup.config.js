import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
const pkg = require('./package.json')

const external = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {}))

/** @returns {import("rollup").RollupOptions[]} */
module.exports = function rollup() {
  return [
    {
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
          exports: 'named'
        },
        {
          format: 'esm',
          dir: 'dist',
          preserveModules: true,
          entryFileNames: '[name].mjs',
          chunkFileNames: '[name].mjs',
          exports: 'named'
        }
      ],
      plugins: [
        typescript({
          tsconfig: 'tsconfig.json',
        }),
        nodeResolve(),
      ]
    }]
}
