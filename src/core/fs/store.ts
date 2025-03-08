import { fdir } from 'fdir';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync, rmdirSync } from 'fs';
import { join, parse } from 'path';
import { DocConfig } from '@/core/schemas';

export class FileStore {
    private cache: string;

    constructor(cache: string) {
        this.cache = cache;

        // Make sure the directory exists
        mkdirSync(this.cache, { recursive: true });
    }

    write(path: string, html: string, json: string) {
        // Create the directory
        mkdirSync(this.getDir(path, 'data'), { recursive: true });
        mkdirSync(this.getDir(path, 'html'), { recursive: true });

        // Write the files
        writeFileSync(this.getFile(path, 'html'), html);
        writeFileSync(this.getFile(path, 'data'), json);
    }

    read(path: string): false | { html: string, transformed: string, meta: DocConfig } {
        try {
            const json = JSON.parse(readFileSync(this.getFile(path, 'data')).toString());
            const html = readFileSync(this.getFile(path, 'html')).toString();
            return {
                html,
                transformed: json[0],
                meta: json[1] as DocConfig
            }
        } catch (_) {
            return false;
        }
    }

    /**
     * Removes cached files for the given path
     * @returns true if files were found and removed, false otherwise
     */
    remove(path: string): boolean {
        try {
            for (const i of ['html', 'data'] as const) {
                rmSync(this.getFile(path, i), { force: true });

                if (readdirSync(this.getDir(path, i)).length === 0) {
                    rmdirSync(this.getDir(path, i));
                }
            }
            return true;
        } catch (_) {
            return false;
        }
    }

    private getDir(path: string, type: 'html' | 'data') {
        if (type === 'html') {
            return join(this.cache, path);
        }
        return join(this.cache, '_', parse(path).dir);
    }

    private getFile(path: string, type: 'html' | 'data') {
        if (type === 'html') {
            return join(this.cache, path, 'index.html');
        }
        return join(this.cache, '_', `${path}.json`);
    }
} 