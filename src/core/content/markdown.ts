import { docSchema, enforceSchema } from '@core/schemas';
import Markdoc from '@markdoc/markdoc';
import { readFileSync } from 'fs';
import yaml from 'yaml';

export function parseMarkdownFile(path: string) {
    const content = readFileSync(path, 'utf-8');
    return transform(content, path);
}

export function parseMarkdown(content: string) {
    const ast = Markdoc.parse(content);
    const transformed = Markdoc.transform(ast);
    const frontmatter = ast.attributes.frontmatter ? yaml.parse(ast.attributes.frontmatter) : {};
    
    return {
        html: Markdoc.renderers.html(transformed),
        json: JSON.stringify(transformed),
        frontmatter
    };
}

export const transform = (content: string, path: string) => {
    const { html: markdownContent, frontmatter } = parseMarkdown(content);

    const ast = Markdoc.parse(markdownContent);
    const transformed = Markdoc.transform(ast);
    const html = Markdoc.renderers.html(transformed);

    const meta = enforceSchema(docSchema, frontmatter, `Failed to read front config of "${path}"`).data;

    return {
        meta: meta,
        html,
        json: JSON.stringify(transformed)
    }
};
/*
export class ContentTransformer {
    //private pluginManager: PluginManager;

    constructor() {
        //this.pluginManager = new PluginManager();
        //this.setupPlugins([]);
    }

    private setupPlugins(plugins) {
        for (const pluginName of plugins) {
            try {
                const plugin = require(`./plugins/${pluginName}`).default;
                this.pluginManager.register(plugin);
            } catch (error) {
                console.warn(`Failed to load plugin: ${pluginName}`, error);
            }
        }
    }

    async transform(path: string): Promise<any> {
        const parsed = await parseMarkdownFile(filePath);

        // Process with plugins first
        const processedContent = await this.pluginManager.process(parsed);


    }

}*/