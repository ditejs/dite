import * as chokidar from '@dite/utils/compiled/chokidar';
import debug from '@dite/utils/compiled/debug';
import fse from '@dite/utils/compiled/fs-extra';
import lodash from '@dite/utils/compiled/lodash';
import Mustache from '@dite/utils/compiled/mustache';
import * as pkgUp from '@dite/utils/compiled/pkg-up';
import resolve from '@dite/utils/compiled/resolve';
import yParser from '@dite/utils/compiled/yargs-parser';
import hbs from 'handlebars';
import * as logger from './logger';
import * as register from './register';

export { compatRequire } from './compatRequire';
export { importLazy } from './importLazy';
export { winPath } from './winPath';
export {
  chokidar,
  debug,
  logger,
  yParser,
  pkgUp,
  Mustache,
  lodash,
  fse,
  hbs,
  resolve,
  register,
};

111;
