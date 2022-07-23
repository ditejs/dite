import { defineBuildConfig } from 'unbuild';

const externals = [
  '@dite/utils/compiled/chokidar',
  '@dite/utils/compiled/debug',
  '@dite/utils/compiled/fs-extra',
  '@dite/utils/compiled/lodash',
  '@dite/utils/compiled/mustache',
  '@dite/utils/compiled/pkg-up',
  '@dite/utils/compiled/resolve',
  '@dite/utils/compiled/yargs-parser',
];

export default defineBuildConfig({
  entries: ['./src/index'],
  outDir: 'dist',
  externals, // [/(@dite\/utils\/compiled\/)/ as unknown as string],
  declaration: true,
});
