import { join, normalize, sep } from 'path';
import { log } from '../logger';
import chokidar from 'chokidar';
//import { pathToURL } from 'utils/path';

const segment = (path: string): string[] => normalize(path).split(sep);

const clear = (group: ASTGroup, transform: TransformResult) => {

  for (const doc of group.documents) {
    // const path = transform.documents.get(doc)?.path;

    transform.documents.delete(doc);
  }

  for (const _group of group.groups) {
    transform.groups.delete(_group);
  }

  transform.groups.delete(group.url);
}

const removeValue = <T>(array: T[], item: any): T[] => {
  return array.filter((value: T) => value !== item);
}

export const watch = (path: string, transform: TransformResult) => {
  const watcher = chokidar.watch(path, {
    persistent: true,
    // cwd: path,
    ignoreInitial: true,
    ignored: (str: string): boolean => {
      const itemPath = str.substring(path.length);

      // Root
      if (itemPath === '') {
        return false;
      }

      // Customization
      if (itemPath.startsWith('/overwrites')) {
        return false;
      }

      if (itemPath.startsWith('/components')) {
        return false;
      }

      if (itemPath.startsWith('/pages')) {
        return false;
      }

      // Markdown / content
      if (itemPath.startsWith('/docs')) {
        return false;
      }

      if (itemPath.startsWith('/versions')) {
        return false;
      }

      if (itemPath.startsWith('/i18n')) {
        return false;
      }

      // Configuration
      if (/^\/[a-zA-Z0-9-_]+.easydocs\.config\.(yaml|yml|json)$/.test(itemPath)) {
        return false;
      }

      if (/^\/easydocs\.config\.(yaml|yml|json)$/.test(itemPath)) {
        return false;
      }

      return true;
    },
  });

  watcher.on('error', (error: Error) => {
    log('error', 'Watcher error', String(error));
  });

  watcher.once('ready', () => {
    log('info', 'Watcher listening to file changes');
  });

  watcher.on('addDir', (p: string) => {
    const segments = segment(p.substring(path.length + 1)).slice(0, -1);
    const parentPath = `${path}${sep}${segments.join(sep)}`;

    if (segments[0] === 'docs') {
      const parentURL = transform.converter.get(parentPath);
      const parentGroup = transform.groups.get(parentURL || '');

      if (!parentGroup || !parentURL) {
        log('error', 'The parent folder does not exists');
        return;
      }

      // updateFolder({} as EasyDocsConfig, parentGroup, transform);
    }
  });

  watcher.on('unlinkDir', (p: string) => {
    const relative = p.substring(path.length + 1);
    const segments = segment(relative).slice(0, -1);
    const parentPath = `${path}${sep}${segments.join(sep)}`;

    const url = transform.converter.get(p);

    if (!url) {
      return;
    }

    if (transform.groups.has(url)) {
      clear(transform.groups.get(url) as ASTGroup, transform);
    }

    const parentURL = transform.converter.get(parentPath);
    const parentGroup = transform.groups.get(parentURL || '');

    if (!parentGroup || !parentURL) {
      return;
    }

    transform.groups.set(parentURL, {
      ...parentGroup,
      groups: removeValue(parentGroup.groups, url)
    });

    console.log(transform.converter);
  });

  /*
  watcher
    .on('add', path => log(`File ${path} has been added`))
    .on('change', path => log(`File ${path} has been changed`))
    .on('unlink', path => log(`File ${path} has been removed`));

  // More possible events.
  watcher
    .on('addDir', path => log(`Directory ${path} has been added`))
    .on('unlinkDir', path => log(`Directory ${path} has been removed`))
    .on('error', error => log(`Watcher error: ${error}`))
    .on('ready', () => log('Initial scan complete. Ready for changes'))
    .on('raw', (event, path, details) => { // internal
      log('Raw event info:', event, path, details);
    });*/
};