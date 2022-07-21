import path from 'path';
import { rollup } from 'rollup';

async function main() {
  const { default: options } = await import(
    path.join(process.cwd(), 'rollup.config.js')
  );
  console.log(111, JSON.stringify(options));
  const bundle = await rollup(options);
  console.log(bundle);
  // or write the bundle to disk
  await bundle.write({
    dir: 'dist',
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
