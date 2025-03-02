import { register } from 'tsconfig-paths';
import { resolve } from 'path';

// Load tsconfig.json
const tsConfig = require('../tsconfig.json');

// Register aliases
register({
  baseUrl: resolve('./'),
  paths: tsConfig.compilerOptions.paths
}); 