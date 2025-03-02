import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export class FileStore {
    private cache: string;

    constructor(cache: string) {
        this.cache = cache;

        // Make sure the directory exists
        mkdirSync(this.cache, { recursive: true });
    }

    write(path: string, html: string, json: string, meta: string) {
        const dir = this.getPageDir(path);

        // Create the directory
        mkdirSync(dir, { recursive: true });

        // Write the files
        writeFileSync(join(dir, 'page.html'), html);
        writeFileSync(join(dir, 'page.json'), json);
        writeFileSync(join(dir, 'meta.json'), meta);
    }

    read(path: string): false | { html: string, json: string } {
        const dir = this.getPageDir(path);
        try {
            return {
                html: readFileSync(join(dir, 'page.html')).toString(),
                json: readFileSync(join(dir, 'page.json')).toString()
            }
        } catch (_) {
            return false;
        }
    }

    private getPageDir(path: string): string {
        return join(this.cache, path);
    }
} 