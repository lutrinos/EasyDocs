/*import { fdir } from "fdir";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import yaml from "yaml";
import { basename, dirname, join } from "path";
import { log } from "../logger";
import { Doc, Group, EasyDocsConfig, enforceSchema, groupSchema } from "@core/schemas";
import { transform } from "../content";
import { FileStore } from './store';


const CONFIG_FILE_EXTENSIONS = ['yaml', 'yml', 'json'];
const MARKDOWN_EXTENSIONS = ['md', 'mdoc'];


interface ASTGroup {
    files: string[];
    groups: string[];
    config: Group;
}

interface ASTDoc {
    front: Doc;
}
*/
/**
 * Explorer class handles the file system traversal and documentation processing
 */
export class Explorer {
    /*private path: string;
    //private groups: Map<string, ASTGroup>;
    //private documents: Map<string, ASTDoc>;
    private baseUrl: string;
    //private fileStore: FileStore;*/

    /*constructor(path: string, config: EasyDocsConfig) {
        this.path = path;
        //this.groups = new Map();
        //this.documents = new Map();
        this.baseUrl = config.baseUrl;
        //this.fileStore = new FileStore();

        //this.buildDocumentationTree();
    }*/

    /**
     * Builds the documentation tree by crawling the file system
     */
    /*private buildDocumentationTree() {
        const crawlResult = this.crawlDirectory();
        
        for (const group of crawlResult) {
            this.processGroup(group);
        }
    }*/

    /**
     * Crawls the directory using fdir
     */
    /*private crawlDirectory() {
        // Create glob pattern for all markdown extensions
        const markdownGlob = `./** /*.{${MARKDOWN_EXTENSIONS.join(',')}}`;
        
        return new fdir()
            .withBasePath()
            .withDirs()
            .withSymlinks({ resolvePaths: true })
            .withRelativePaths()
            .withPathSeparator('/')
            .withErrors()
            .group()
            .glob(markdownGlob)
            .crawl(this.path)
            .sync()
            .reverse();
    }*/

    /**
     * Processes a single group from the crawl result
     */
    /*private processGroup(group: { directory: string; files: string[] }) {
        const relativePath = group.directory.substring(this.path.length);
        const parentPath = dirname(group.directory).substring(this.path.length) + '/';

        // Sort files by extension priority
        const prioritizedFiles = this.prioritizeFilesByExtension(group.files);

        this.updateParentGroup(parentPath, relativePath);
        const groupConfig = this.createGroupConfig(relativePath, parentPath);
        
        this.createOutputDirectory(groupConfig.url as string);
        this.addGroupToMap(relativePath, prioritizedFiles, groupConfig);
        
        this.processGroupFiles(prioritizedFiles, groupConfig);
    }*/

    /**
     * Updates the parent group with new child group
     */
    /*private updateParentGroup(parentPath: string, childPath: string): void {
        const parentGroup = this.groups.get(parentPath);
        if (parentGroup) {
            parentGroup.groups.push(childPath);
            this.groups.set(parentPath, parentGroup);
        }
    }*/

    /**
     * Creates group configuration by merging with parent config
     */
    /*
    private createGroupConfig(path: string, parentPath: string): Group {
        const parentGroup = this.groups.get(parentPath);
        const baseUrl = parentGroup 
            ? join(parentGroup.config.url as string, basename(path))
            : this.baseUrl;

        return Object.assign({ url: baseUrl }, this.readConfig(path));
    }*/

    /**
     * Creates output directory for the group
     */
    /*
    private createOutputDirectory(url: string): void {
        mkdirSync(join(process.cwd(), '.easydocs', url), { recursive: true });
    }*/

    /**
     * Adds a new group to the groups map
     */
    /*
    private addGroupToMap(path: string, files: string[], config: Group): void {
        this.groups.set(path, {
            files,
            groups: [],
            config
        });
    }*/

    /**
     * Processes all files in a group
     */
    /*
    private processGroupFiles(files: string[], groupConfig: Group): void {
        for (const file of files) {
            const filePath = join(this.path, file);
            const url = this.generateFileUrl(file, groupConfig.url as string);

            // Check if we need to process this file
            if (!this.fileStore.needsUpdate(url, filePath)) {
                const cached = this.fileStore.read(url, filePath);
                if (cached) {
                    this.documents.set(file, {
                        front: Object.assign({ url }, JSON.parse(cached.json))
                    });
                    continue;
                }
            }

            // Process the file if needed
            const output = transform(filePath);
            
            this.documents.set(file, {
                front: Object.assign({ url }, output.front)
            });

            this.fileStore.write(url, output.html, output.json);
        }
    }*/

    /**
     * Generates URL for a file based on group config
     */
    /*
    private generateFileUrl(file: string, groupUrl: string): string {
        // Check if file is an index file in any supported extension
        const isIndex = MARKDOWN_EXTENSIONS.some(ext => 
            file.endsWith(`index.${ext}`)
        );

        if (isIndex) {
            return groupUrl;
        }

        // Remove any supported markdown extension from filename
        const filename = basename(file);
        const extensionPattern = new RegExp(`\\.(${MARKDOWN_EXTENSIONS.join('|')})$`);
        return join(groupUrl, filename.replace(extensionPattern, ''));
    }*/

    /**
     * Reads and validates configuration from config files
     */
    /*
    private readConfig(path: string): Group {
        for (const ext of CONFIG_FILE_EXTENSIONS) {
            try {
                const configPath = join(this.path, path, `config.${ext}`);
                const content = readFileSync(configPath, 'utf-8');
                const data = ext === 'json' ? JSON.parse(content) : yaml.parse(content);

                return enforceSchema(
                    groupSchema,
                    data,
                    `Error reading group config file "${path}"`
                ).data;
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
                    log('error', `Error reading config file:`, (error as Error).message, path);
                }
                continue;
            }
        }
        
        return enforceSchema(groupSchema, {}, '').data;
    }*/

    /**
     * Prioritizes files based on extension order in MARKDOWN_EXTENSIONS
     * First extension in the array has highest priority
     */
    /*private prioritizeFilesByExtension(files: string[]): string[] {
        // Sort files by base name and extension priority
        const sortedFiles = [...files].sort((a, b) => {
            const filenameA = basename(a);
            const filenameB = basename(b);
            
            // Get base names without extensions
            const lastDotA = filenameA.lastIndexOf('.');
            const lastDotB = filenameB.lastIndexOf('.');
            
            const baseNameA = lastDotA === -1 ? filenameA : filenameA.slice(0, lastDotA);
            const baseNameB = lastDotB === -1 ? filenameB : filenameB.slice(0, lastDotB);
            
            // If base names are different, sort alphabetically
            if (baseNameA !== baseNameB) {
                return baseNameA.localeCompare(baseNameB);
            }
            
            // If base names are same, sort by extension priority
            const extA = lastDotA === -1 ? '' : filenameA.slice(lastDotA + 1);
            const extB = lastDotB === -1 ? '' : filenameB.slice(lastDotB + 1);
            return MARKDOWN_EXTENSIONS.indexOf(extA) - MARKDOWN_EXTENSIONS.indexOf(extB);
        });

        // Keep only the first file for each base name
        const seen = new Set<string>();
        const prioritizedFiles = sortedFiles.filter(file => {
            const filename = basename(file);
            const lastDot = filename.lastIndexOf('.');
            const baseName = lastDot === -1 ? filename : filename.slice(0, lastDot);
            
            if (seen.has(baseName)) {
                // Log warning for duplicate files
                log('warn', `Ignoring duplicate file: "${filename}"`);
                return false;
            }
            seen.add(baseName);
            return true;
        });

        return prioritizedFiles;
    }*/

    /**
     * Merges another explorer instance into this one
     */
    merge(explorer: Explorer): void {
        // TODO: Implement merge functionality
    }

    /**
     * Apply a file modifications
     */
    update(path: string) {
        // TODO: Implement update functionality
    }
}