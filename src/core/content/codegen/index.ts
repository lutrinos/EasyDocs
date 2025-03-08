import * as lightningcss from 'lightningcss';
import * as esbuild from 'esbuild';
import browserslist from 'browserslist';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { log } from '../../logger';

const targets = lightningcss.browserslistToTargets(browserslist('>= 0.25%'));

const handleError = (fn: any, msg: string) => {
  try {
    return fn();
  } catch (err: any) {
    log('error', err.toString());
  }
  throw Error(msg);
}

export const buildCSS = async (dirname: string) => {

  let { code } = await handleError(() => lightningcss.bundleAsync({
    targets,

    filename: join(dirname, 'client', 'App.css'),

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
  }), 'Failed to build css with lightningcss');

  /*const compiler = await handleError(() => compile('@import "tailwindcss";\n' + _code.toString(), {
    base: join(dirname, 'client'),
    onDependency: (p: string) => {}
  }), 'Failed to compile css with tailwindcss');

  console.log(compiler);
  
  const result = handleError(() => compiler.build([]), 'Failed to build css with tailwind css');

  //console.log(result.toString());

  const code = handleError(() => lightningcss.transform({
    code: Buffer.from(result),
    filename: '',
    targets,
    minify: true
  }).code.toString(), 'Failed to minify css with lightningcss');*/

  writeFileSync(join(process.cwd(), '.easydocs', '_', 'index.css'), code);

  log('success', 'Built css');
}


export const buildJs = async (dirname: string) => {

  await esbuild.build({
    entryPoints: [join(dirname, 'client', 'App.tsx')],
    outfile: join(process.cwd(), '.easydocs', '_', 'index.js'),
    minify: true,
    bundle: true,
    platform: 'browser',
    treeShaking: true,
    jsxImportSource: 'preact',
    jsx: 'automatic'
  });


  log('success', 'Built js');
}