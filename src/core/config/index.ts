import yaml from 'yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { log } from '@/core/logger';
import { EasyDocsConfig, configSchema, enforceSchema } from '@core/schemas';

const parseConfig = (data: unknown): EasyDocsConfig => {
  const result = enforceSchema(configSchema, data, 'Failed to read configuration.');

  if (result.success) {
      return result.data;
  }

  log('warn', 'Since there was an error while reading the config, using defaults');
  return enforceSchema(configSchema, {}, '').data;
}; 


export const loadConfig = (rootDir: string): EasyDocsConfig => {
  const configPaths = [
    join(rootDir, 'docs.config.yaml'),
    join(rootDir, 'docs.config.yml'),
    join(rootDir, 'docs.config.json')
  ];

  for (const configPath of configPaths) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      const data = configPath.endsWith('.json') 
        ? JSON.parse(content)
        : yaml.parse(content);

      log('info', `Reading config from "${configPath}"`);
      
      return parseConfig(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        log('error', `Error reading config file:`, (error as Error).message, configPath);
      }
      continue;
    }
  }

  // No config found, return default config
  log('warn', 'No config file found, using defaults');
  return enforceSchema(configSchema, {}, '').data;
};