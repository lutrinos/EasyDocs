import { mkdirSync, writeFileSync, readFileSync, statSync, existsSync } from 'fs';
import { join, dirname, parse } from 'path';

interface PageData {
    html: string;
    json: string;
    lastModified: number;
}

export class FileStore {
    private cacheDir: string;

    constructor(cacheDir: string) {
        this.cacheDir = cacheDir
        mkdirSync(this.cacheDir, { recursive: true });
    }

    /**
     * Writes page data to the store
     */
    write(url: string, html: string, json: string): void {
        const normalizedUrl = url === '/' ? '/index' : url;
        
        // Create directories if it doesn't exist
        mkdirSync(join(this.cacheDir, normalizedUrl), { recursive: true });
        mkdirSync(join(this.cacheDir, '_', parse(normalizedUrl).dir), { recursive: true });

        const data: PageData = {
            html,
            json,
            lastModified: Date.now()
        };

        // Write the HTML file
        writeFileSync(join(this.cacheDir, normalizedUrl, 'index.html'), html);
        
        // Write the metadata and JSON content
        writeFileSync(join(this.cacheDir, '_', `${normalizedUrl}.json`), JSON.stringify(data));
    }

    /**
     * Reads page data from the store
     * Returns null if the page doesn't exist or is outdated
     */
    read(url: string, sourceFilePath: string): PageData | null {
        try {
            const normalizedUrl = url === '/' ? '/index' : url;
            const pageDir = join(this.cacheDir, normalizedUrl);
            const jsonPath = join(pageDir, 'index.json');

            // Check if cached files exist
            if (!existsSync(jsonPath)) {
                return null;
            }

            // Read the metadata and check if it's outdated
            const data: PageData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
            const sourceStats = statSync(sourceFilePath);

            // Return null if source file is newer than cached files
            if (sourceStats.mtimeMs > data.lastModified) {
                return null;
            }

            // Read the HTML file
            data.html = readFileSync(join(pageDir, 'index.html'), 'utf-8');
            
            return data;
        } catch (error) {
            return null;
        }
    }

    /**
     * Checks if a page needs to be updated
     */
    needsUpdate(url: string, sourceFilePath: string): boolean {
        return this.read(url, sourceFilePath) === null;
    }

    /**
     * Cleans up old cached files that are no longer needed
     * This method would be called periodically or during builds
     */
    cleanup(validUrls: Set<string>): void {
        // TODO: Implement cleanup of old cached files
        // Walk through .easydocs directory and remove files 
        // that don't correspond to validUrls
    }
} 