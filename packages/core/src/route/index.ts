import glob from '@dite/utils/compiled/fast-glob';
import path, { resolve } from 'path';
import { RouteItem } from './routeConfig';
import {
  createRouteId,
  createRoutePath,
  createRouteRegex,
  findParentRouteId,
} from './utils';

const pageDirName = 'pages';

const getFeDir = () => {
  return resolve(process.cwd(), process.env.FE_ROOT ?? 'src');
};

function byLongestFirst(a: string, b: string): number {
  return b.length - a.length;
}

export function getRoutes(_config: any): RouteItem[] {
  const pageDir = path.join(getFeDir(), pageDirName);
  const files = glob
    .sync('**/*.{js,jsx,ts,tsx}', { cwd: pageDir })
    .reduce<{ [routeId: string]: string }>(
      (files: Record<string, string>, file: string) => {
        const filePath = path.join(pageDirName, file);
        const routeId = createRouteId(filePath);
        files[routeId] = filePath;
        return files;
      },
      {},
    );

  const routeIds = Object.keys(files).sort(byLongestFirst);
  const uniqueRoutes: Record<string, RouteItem> = Object.create(null);

  routeIds.forEach((routeId) => {
    const parentId = '';
    const routePath: string | undefined = createRoutePath(
      routeId.slice((parentId || 'pages').length + 1),
    );
    // let fullPath = createRoutePath(routeId.slice(pageDirName.length + 1));
    const isIndexRoute = routeId.endsWith('/index');
    // let uniqueRouteId = (fullPath || '') + (isIndexRoute ? '?index' : '');
    if (isIndexRoute) {
      const invalidChildRoutes = routeIds.filter(
        (id) => findParentRouteId(routeIds, id) === routeId,
      );

      if (invalidChildRoutes.length > 0) {
        throw new Error(
          `Child routes are not allowed in index routes. Please remove child routes of ${routeId}`,
        );
      }

      const route: any = {
        path: routePath ? routePath : '',
        index: true,
        id: createRouteId(files[routeId]),
        regex: createRouteRegex(routePath || '/'),
        file: files[routeId],
      };

      uniqueRoutes[route.id] = route;
    } else {
      const route: any = {
        path: routePath ? routePath : '',
        id: createRouteId(files[routeId]),
        regex: createRouteRegex(routePath || '/'),
        file: files[routeId],
      };
      uniqueRoutes[route.id] = route;
    }
  });
  return Object.values(uniqueRoutes);
}

export function formatRoutes(
  config: any,
  type: 'json' | 'jsx' | 'raw' = 'jsx',
) {
  const routes = getRoutes(config);
  if (type === 'json') {
    return JSON.stringify(routes || null, null, 2);
  } else if (type === 'raw') {
    return routes;
  }
  return formatRoutesAsJsx(routes);
}

export function formatRoutesAsJsx(routes: any) {
  let output = '<Routes>';

  const level = 1;
  const indent = Array(level * 2)
    .fill(' ')
    .join('');

  for (const route of routes) {
    output += '\n' + indent;
    output += `<Route${
      route.path ? ` path=${JSON.stringify(route.path)}` : ''
    }${route.index ? ' index' : ''}${
      route.file ? ` file=${JSON.stringify(route.file)}` : ''
    }>`;
    output = output.slice(0, -1) + ' />';
  }

  output += '\n</Routes>';
  return output;
}
