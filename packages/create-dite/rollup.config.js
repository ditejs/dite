import typescript from '@rollup/plugin-typescript';
const path = require('path');
import { fse } from '@dite/utils';

const pkg = fse.readJSONSync(path.join(__dirname, 'package.json'));
const external = Object.keys(pkg.dependencies).concat(['path', 'fs', 'typescript', 'dite']);

module.exports = {
  input: 'src/index.ts',
  plugins: [typescript({
    sourceMap: false,
    tsconfig: path.resolve(__dirname, './tsconfig.json')
  })],
  external,
  output: [
    {format: 'cjs', file: pkg.main, exports: 'auto'},
    {format: 'esm', file: pkg.module}
  ]
}
