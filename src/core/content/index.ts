import { FileStore } from '../fs/store';
import { join, parse } from 'path';
import { crawl } from '../fs';
import { CONFIG_FILE_EXTENSIONS, MARKDOWN_EXTENSIONS } from '../constants';
import { parseMarkdownFile } from './markdown';
import { Group } from 'fdir';
import { enforceSchema, GroupConfig, groupSchema } from '@/core/schemas';
import { readFileSync } from 'fs';
import yaml from "yaml";
import { log } from '../logger';
import Tree from './tree';
import { interpolate, joinURL } from './strings';
import chokidar from "chokidar";
import { HTML_TEMPLATE } from './template';

export * from "./strings";

export class ContentManager {
  private path: string;
  private store: FileStore;
  private tree = new Tree();
  private prefix: string;
  private watcher: chokidar.FSWatcher | null = null;

  constructor(path: string, prefix: string) {
    this.prefix = prefix;
    this.path = join(path, 'docs');
    this.store = new FileStore(join(path, this.prefix));
  }

  async processDirectory() {
    const groups = await crawl(this.path, MARKDOWN_EXTENSIONS);

    for await (const group of groups) {
      await this.processGroup(group);
    }

    return this.tree.toJSON();
  }

  private segments(path: string): string[] {
    return path.substring(this.path.length)
      .split('/')
      .filter((i) => i.length > 0);
  }

  private async processGroup(group: Group) {
    const segments = this.segments(group.directory);
    const config = this.readConfig(group.directory);
    let parent = this.tree.find(segments.slice(0, -1));

    const groupUrl = segments.length === 0
      ? '/'
      : (config.url ?? joinURL(parent?.url ?? '/', config.slug));

    this.tree.add(segments, 'group', groupUrl, config);

    for (const file of group.files) {
      this.processFile(join(this.path, file), groupUrl);
    }
  }

  private async processFile(path: string, groupUrl: string) {
    const output = parseMarkdownFile(path);

    // Remove extension and build URL path
    const fileName = parse(path).name;

    let url;
    if (fileName === 'index') {
      url = groupUrl;
    } else {
      url = joinURL(groupUrl, fileName);
    }

    this.store.write(
      url,
      interpolate(HTML_TEMPLATE, {
        html: output.html,
        title: output.meta.title
      }),
      JSON.stringify([output.transformed, output.meta])
    );
    this.tree.add(this.segments(path), 'document', url, output.meta);
  }

  /**
   * Reads and validates configuration from config files
   */
  private readConfig(path: string): GroupConfig {
    const defaults = {
      title: parse(path).name,
      slug: parse(path).name
    };

    for (const ext of CONFIG_FILE_EXTENSIONS) {
      try {
        const configPath = join(path, path, `config.${ext}`);
        const content = readFileSync(configPath).toString();
        const data = ext === 'json' ? JSON.parse(content) : yaml.parse(content);

        return enforceSchema(
          groupSchema,
          Object.assign(defaults, data),
          `Error reading group config file "${path}"`
        ).data;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          log('error', `Error reading config file:`, (error as Error).message, path);
        }
        continue;
      }
    }

    return enforceSchema<GroupConfig>(groupSchema, defaults, '').data;
  }

  watch() {
    this.watcher = chokidar.watch(this.path, {
      persistent: true,
      ignoreInitial: true,
      followSymlinks: false,
      cwd: this.path,
      ignorePermissionErrors: true,

    });

    this.watcher
      .on('all', (event, path) => {
        //log('debug', `File system event: ${event} ${path}`);
      })
      .on('add', async (path) => {
        try {
          const parentUrl = this.tree.find(this.segments(join(this.path, path)).slice(0, -1))?.url ?? '/';
          await this.processFile(join(this.path, path), parentUrl);
          log('info', `Added file ${path}`);
        } catch (error) {
          log('error', `Error processing new file ${path}:`, (error as Error).message);
        }
      })
      .on('change', async (path) => {
        try {
          const fullPath = join(this.path, path);
          const segments = this.segments(fullPath);
          const file = this.tree.find(segments);

          // Remove existing file from cache if it exists
          if (file) this.store.remove(file.url);

          // Process updated file
          const parentUrl = this.tree.find(segments.slice(0, -1))?.url ?? '/';
          await this.processFile(fullPath, parentUrl);
          log('info', `Updated file ${path}`);
        } catch (error) {
          log('error', `Error processing changed file ${path}:`, (error as Error).message);
        }
      })
      .on('unlink', (path) => {
        try {
          const segments = this.segments(path);
          const file = this.tree.find(segments);

          if (file?.url) {
            this.store.remove(file.url);
            this.tree.remove(segments);
            log('info', `Removed file ${path}`);
          }
        } catch (error) {
          log('error', `Error removing file ${path}:`, (error as Error).message);
        }
      })
      .on('error', (error) => {
        log('error', 'File watcher error:', error.message);
      });
    ;
    /*
    .on('change', () => {})
    .on('addDir', (path) => log(`Directory ${path} has been added`))
    .on('unlinkDir', (path) => log(`Directory ${path} has been removed`))
    .on('error', (error) => log(`Watcher error: ${error}`))
    .on('ready', () => log('Initial scan complete. Ready for changes'))*/
  }

  unwatch() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}