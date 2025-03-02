import { FileStore } from '../fs/store';
import { basename, join, parse } from 'path';
import { crawl } from '../fs';
import { CONFIG_FILE_EXTENSIONS, MARKDOWN_EXTENSIONS } from '../constants';
import { parseMarkdownFile } from './markdown';
import { Group } from 'fdir';
import { enforceSchema, GroupConfig, groupSchema } from '@/core/schemas';
import { readFileSync } from 'fs';
import yaml from "yaml";
import { log } from '../logger';
import Tree from './tree';
import { joinURL } from './strings';

export * from "./strings";

export class ContentManager {
  private path: string;
  private store: FileStore;
  private tree = new Tree();

  constructor(path: string) {
    this.path = join(path, 'docs');
    this.store = new FileStore(join(path, '.easydocs'));
  }

  async processDirectory() {
    const groups = await crawl(this.path, MARKDOWN_EXTENSIONS);
    const results = [];

    for (const group of groups) {
      const groupData = await this.processGroup(group);
      results.push(groupData);
    }

    return this.tree.toJSON();
  }

  private segments (path: string): string[] {
    return path.substring(this.path.length)
      .split('/')
      .filter((i) => i.length > 0);
  }

  private async processGroup(group: Group) {
    const segments = this.segments(group.directory);
    const config = this.readConfig(group.directory);
    let parent = this.tree.find(segments.slice(0, -1));

    const processed = [];
    const groupUrl = config.url ?? joinURL(parent?.url ?? '/', config.slug);

    this.tree.add(segments, 'group', groupUrl, config);

    for (const file of group.files) {
      const filePath = join(group.directory, basename(file));
      const output = parseMarkdownFile(filePath);
      processed.push(file);

      // Remove extension and build URL path
      const fileName = file.replace(/\.[^/.]+$/, "");
      let url;
      if (fileName === 'index' || fileName.endsWith('/index')) {
        url = groupUrl;
      } else {
        url = joinURL(groupUrl, fileName);
      }
      
      this.store.write(url, output.html, output.json, JSON.stringify(output.meta));
      this.tree.add(filePath.split('/'), 'document', url, output.meta);
    }

    return {
      files: processed,
      groups: [],
      config: this.readConfig(group.directory)
    };
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
}