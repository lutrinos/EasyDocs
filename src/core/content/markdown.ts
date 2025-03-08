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

// TODO: Switch from markdoc to markdown-it
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

        /*for (const node of  ast.walk()) {
            console.log(node.type);

            if (node.type === 'text') {
                console.log(node);
            }
        }*/

        const front = ast.attributes.frontmatter ? yaml.parse(ast.attributes.frontmatter) : {};
        const transformed = await Markdoc.transform(ast, {
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
                prismTheme: 'okaida',
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