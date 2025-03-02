import './register';

import { log } from "@core/logger";
import { buildCSS, buildJs } from "@/core/content/codegen";
import { loadConfig } from '@core/config';

import mime from 'mime-types';
import Elysia, { ElysiaFile, file } from "elysia";
import node from "@elysiajs/node";
import path, { join } from 'path';
import { ContentManager } from './core/content';
import { existsSync, mkdirSync, statSync } from 'fs';
import pc from 'picocolors';

interface ServerContext {
  set: {
    headers: Record<string, string>,
    status?: number
  }
}

const indent = (str: string, count: number): string => {
  return ' '.repeat(count) + str.replace(/\n/g, '\n' + ' '.repeat(count));
}

const build = async (dirname: string) => {
  try {
    mkdirSync(path.join(process.cwd(), '.easydocs'), { recursive: true });

    const config = loadConfig(dirname);

    await buildCSS(__dirname);
    await buildJs(__dirname);

    const manager = new ContentManager(process.cwd(), '.easydocs');
    await manager.processDirectory();
    await manager.watch();

    return true;
  } catch (error) {
    log('error', 'Build failed:', (error as Error).message, pc.red(indent((error as Error).stack ?? '', 12)));
    return false;
  }
}

const checkStatic = (url: string): string | false => {
  url = (url.endsWith('/') ? url.slice(0, -1) : url).replace(/\/+/g, '/');
  const path = join(process.cwd(), '.easydocs', url);
  if (existsSync(path) && statSync(path).isFile()) {
    return path;
  }
  return false;
}

new Elysia({ adapter: node() })
  .get('/build', async () => {
    await buildCSS(__dirname);
    await buildJs(__dirname);
    return 'Ok';
  })
  .get("/*", ({ params, set }: { params: { '*': string } } & ServerContext) => {
    const filePath = params['*'];

    for (const i of [filePath, filePath + '/index.html']) {
      const result = checkStatic(i);

      if (result) {
        return file(result);
      }
    }
  })
  /*.get('/*', ({ set, params }: { params: { '*': string } } & ServerContext) => {
    const url = params['*'];
    const path = join(process.cwd(), '.easydocs', url, 'index.html');
    if (existsSync(path)) {
      set.headers['Content-Type'] = 'text/html; charset=utf-8';
      return file(path);
    }
  })*/
  .onError(({ error, set }) => {
    log('error', 'Server error:', (error as Error).message);
    set.status = 500;

    if (error instanceof Error && error.message.includes('ENOENT')) {
      set.status = 404;
      return { error: 'Resource not found' };
    }

    return { error: 'Internal server error' };
  })
  .listen(3030, ({ hostname, port }) => {
    log('info', `EasyDocs is running at ${hostname}:${port}`);
    build(process.cwd()).catch(error =>
      log('error', 'Initial build failed:', error.message)
    );
  });
