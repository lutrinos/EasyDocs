import { docSchema, enforceSchema } from '@core/schemas';
import Markdoc from '@markdoc/markdoc';
import { readFileSync } from 'fs';
import yaml from 'yaml';

import headingMarkdoc from './markdoc/heading.markdoc';

export function parseMarkdownFile(path: string) {
    const content = readFileSync(path, 'utf-8');
    return transform(content, path);
}


export const transform = (content: string, path: string) => {
    const ast = Markdoc.parse(content);
    const front = ast.attributes.frontmatter ? yaml.parse(ast.attributes.frontmatter) : {};
    const transformed = Markdoc.transform(ast, {
        tags: {},
        nodes: {
            heading: headingMarkdoc
        },
        variables: {
            ...front
        }
    });

    const meta = enforceSchema(docSchema, front, `Failed to read front config of "${path}"`).data;

    return {
        html: Markdoc.renderers.html(transformed),
        transformed,
        meta
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