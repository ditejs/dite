import { addUnWatch, run, unwatch, watch } from '@dite/core';
import getPort from '@dite/core/compiled/get-port';
import { fse, lodash, logger } from '@dite/utils';
import path from 'path';
import { buildDir, Builder } from '../../bundles/esbuild/build';
import { TEMPLATES_DIR } from '../../constants';
import type { IApi } from '../../types';

const startServer = (
  builder: Builder,
  opts: {
    cwd: string;
    port: number;
  },
) => {
  const modulePath = path.join(opts.cwd, '.dite/server/main.js');
  const command = `node ${modulePath}`;
  const runServer = () => {
    return run(command, {
      cwd: opts.cwd,
      env: {
        PORT: opts.port,
      },
    });
  };
  let unwatch = runServer();

  const reload = lodash.debounce(() => {
    unwatch();
    unwatch = runServer();
  }, 150);
  const watcher = watch({
    path: path.join(opts.cwd, 'server'),
    onChange: async (event: string, path: string) => {
      logger.debug(`[ Dite ] Auto reload. [${event}] ${path}`);
      if (['change'].includes(event)) {
        await builder.build(path, { isFirstTime: false });
        reload();
      }
    },
  });
  return () => {
    unwatch();
    watcher.close();
  };
};

const templateNames = (pkg: any) => {
  if (pkg.dependencies['@dite/nest']) {
    return 'dite.nest.tpl';
  }
  return 'dite.server.tpl';
};

export default (api: IApi) => {
  api.registerCommand({
    name: 'dev',
    description: 'dev server for development',
    details: `
dite dev

# dev with specified port
PORT=3001 dite dev
`,
    async fn() {
      const pkgPath = path.join(api.cwd, 'package.json');
      const pkg = fse.readJSONSync(pkgPath);
      let now = Date.now();
      api.writeTmpFile({
        noPluginDir: true,
        path: 'dite.server.js',
        tplPath: path.join(TEMPLATES_DIR, templateNames(pkg)),
        format: 'cjs',
        context: {
          name: templateNames(pkg),
          cwd: path.join(api.cwd),
        },
      });
      console.log('write duration:', Date.now() - now);
      now = Date.now();
      const builder = await buildDir({
        dir: path.join(api.cwd, 'server'),
        cwd: api.cwd,
        env: api.env,
      });
      console.log(`[ Dite ] Build time: ${Date.now() - now}ms`);
      now = Date.now();
      addUnWatch(
        startServer(builder, {
          cwd: api.cwd,
          port: api.appData.config.port,
        }),
      );

      // watch config change
      addUnWatch(
        api.service.configManager!.watch({
          schemas: api.service.configSchemas,
          onChangeTypes: api.service.configOnChanges,
          async onChange(opts) {
            await api.applyPlugins({
              key: 'onCheckConfig',
              args: {
                config: api.config,
                userConfig: api.userConfig,
              },
            });
            const { data } = opts;
            if (data.changes[api.ConfigChangeType.reload]) {
              console.log(
                `config ${data.changes[api.ConfigChangeType.reload].join(
                  ', ',
                )} changed, restart server...`,
              );
              api.restartServer();
              return;
            }
            await api.service.resolveConfig();
            if (data.changes[api.ConfigChangeType.regenerateTmpFiles]) {
              console.log(
                `config ${data.changes[
                  api.ConfigChangeType.regenerateTmpFiles
                ].join(', ')} changed, regenerate tmp files...`,
              );
              // await generate({ isFirstTime: false });
            }
            for (const fn of data.fns) {
              fn();
            }
          },
        }),
      );
    },
  });

  api.modifyAppData(async (memo) => {
    memo.config.port = await getPort({
      port: memo.config.port ?? 3001,
    });
    memo.port = memo.config.port;
    return memo;
  });

  api.registerMethod({
    name: 'restartServer',
    async fn() {
      console.log(`Restart dev server with port ${api.appData.port}...`);
      await unwatch();
      process.send?.({
        type: 'RESTART',
        payload: {
          port: api.appData.config.port,
        },
      });
    },
  });
};
