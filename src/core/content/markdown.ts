import { docSchema, enforceSchema } from '@core/schemas';
import Markdoc from '@markdoc/markdoc';
import { readFileSync } from 'fs';
import yaml from 'yaml';

import headingMarkdoc from './markdoc/heading.markdoc';
import fenceMarkdoc from './markdoc/fence.markdoc';
import { tabs, tab } from './markdoc/tabs.markdoc';
import { PluginManager } from './plugins';
import { html } from './markdoc/html.markdoc';
import { katexPlugin } from './plugins/katex';
import { emojisPlugin } from './plugins/emojis';

/*
export function parseMarkdownFile(path: string) {
    const content = readFileSync(path, 'utf-8');
    return transform(content, path);
}*/


export class MarkdownTransformer {
    private pluginManager: PluginManager = new PluginManager();

    constructor() {
        this.pluginManager.register(emojisPlugin);
        this.pluginManager.register(katexPlugin);
    }

    async transform(path: string): Promise<any> {
        let content = readFileSync(path).toString();

        // Process with plugins first
        content = await this.pluginManager.process(content);

        // Parse
        const ast = Markdoc.parse(content);
        const front = ast.attributes.frontmatter ? yaml.parse(ast.attributes.frontmatter) : {};
        const transformed = Markdoc.transform(ast, {
            tags: {
                tabs,
                tab,
                html
            },
            nodes: {
                heading: headingMarkdoc,
                fence: fenceMarkdoc
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
    }

}