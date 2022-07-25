import { lodash } from '@dite/utils';
import fs from 'fs';
import path from 'path';
import type { RollupOptions } from 'rollup';
import { rollup } from 'rollup';

// import defaultRollupOptions from './utils/rollupConfig'

async function main() {
  let opts: RollupOptions | RollupOptions[];
  const rollupConfigFile = path.join(process.cwd(), 'rollup.config.js');
  if (fs.existsSync(rollupConfigFile)) {
    opts = (await import(rollupConfigFile)).default;
  } else {
    opts = (await import('./utils/rollupConfig')).default;
  }
  const options: RollupOptions[] = lodash.isArray(opts) ? opts : [opts];
  await Promise.all(
    options.map(async (option) => {
      const bundle = await rollup(option);
      const res = await bundle.generate(option);
      console.log(res);
      // or write the bundle to disk
      if (option.output) {
        if (lodash.isArray(option.output)) {
          await Promise.all(
            option.output.map(async (output) => {
              await bundle.write(output);
            }),
          );
        } else {
          await bundle.write(option.output);
        }
      }
      console.log('111');
    }),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
