import './register';

import { log } from "@core/logger";
import { buildCSS, buildHTML, buildJs } from "@/core/content/codegen";
import { loadConfig } from '@core/config';

import mime from 'mime-types';
import Elysia, { file } from "elysia";
import node from "@elysiajs/node";
import path, { join } from 'path';
import { ContentManager, interpolate } from './core/content';
import { mkdirSync } from 'fs';
import pc from 'picocolors';
import { pathToFileURL } from 'url';

interface ServerContext {
  set: { 
    headers: Record<string, string>,
    status?: number 
  }
}

const indent = (str: string, count: number): string => {
  return ' '.repeat(count) + str.replace(/\n/g, '\n'+ ' '.repeat(count));
}

const build = async (dirname: string) => {
  try {
    mkdirSync(path.join(process.cwd(), '.easydocs'), { recursive: true });

    const config = loadConfig(dirname);
    
    await buildHTML(__dirname);
    await buildCSS(__dirname);
    await buildJs(__dirname);

    const manager = new ContentManager(process.cwd());
    const result = await manager.processDirectory();

    return true;
  } catch (error) {
    log('error', 'Build failed:', (error as Error).message, pc.red(indent((error as Error).stack ?? '', 12)));
    return false;
  }
}

new Elysia({ adapter: node() })
  .get("/_/*", ({ params, set }: { params: { '*': string } } & ServerContext) => {
    const filePath = params['*'];
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    
    set.headers['Content-Type'] = `${mimeType}; charset=utf-8`;
    
    return file(`.easydocs/${filePath}`);
  })
  .get('/build', async ({ set }: ServerContext) => {
    const success = await build(__dirname);
    
    if (!success) {
      set.status = 500;
      return { error: 'Build failed' };
    }

    return { status: 'success' };
  })
  .get('/*', ({ set }: ServerContext) => {
    set.headers['Content-Type'] = 'text/html; charset=utf-8';
    return file('.easydocs/index.html');
  })
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
