import * as lightningcss from 'lightningcss';
import * as esbuild from 'esbuild';
import browserslist from 'browserslist';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { log } from '../../logger';

const targets = lightningcss.browserslistToTargets(browserslist('>= 0.25%'));

export const buildCSS = async (dirname: string) => {
  let { code } = await lightningcss.bundleAsync({
    targets,

    filename: join(dirname, 'client', 'App.css'),
    minify: true,

    resolver: {
      resolve(specifier: string, from: string) {
        const custom = join(process.cwd(), 'overwrites', specifier);

        if (existsSync(custom)) {
          return custom;
        }

        return join(dirname, 'client', specifier);
        // return path.resolve(path.dirname(from), specifier);
      }
    }
  });

  writeFileSync(join(process.cwd(), '.easydocs', 'index.css'), code);


  log('success', 'Built css');
}


export const buildJs = async (dirname: string) => {

  await esbuild.build({
    entryPoints: [join(dirname, 'client', 'App.tsx')],
    outfile: join(process.cwd(), '.easydocs', 'index.js'),
    minify: true,
    bundle: true,
    platform: 'browser',
    treeShaking: true,
    jsxImportSource: 'preact',
    jsx: 'automatic'
  });


  log('success', 'Built js');
}

export const buildHTML = (dirname: string) => {
  const html = readFileSync(join(dirname, 'client', 'index.html'));

  writeFileSync(join(process.cwd(), '.easydocs', 'index.html'), html);
}
