/*
import Markdoc from '@markdoc/markdoc';

export interface Plugin {
    name: string;
    transform: (content: ParsedContent) => Promise<ParsedContent>;
    // Optional Markdoc config
    config?: {
        nodes?: Record<string, Markdoc.Config>;
        tags?: Record<string, Markdoc.Config>;
        variables?: Record<string, any>;
    };
}

export class PluginManager {
    private plugins: Plugin[] = [];

    register(plugin: Plugin) {
        this.plugins.push(plugin);
    }

    async process(content: ParsedContent): Promise<ParsedContent> {
        let result = content;
        
        for (const plugin of this.plugins) {
            result = await plugin.transform(result);
        }
        
        return result;
    }

    getConfig(): Markdoc.Config {
        const config: Markdoc.Config = {
            nodes: {},
            tags: {},
            variables: {}
        };

        // Merge all plugin configs
        for (const plugin of this.plugins) {
            if (plugin.config) {
                if (plugin.config.nodes) {
                    config.nodes = { ...config.nodes, ...plugin.config.nodes };
                }
                if (plugin.config.tags) {
                    config.tags = { ...config.tags, ...plugin.config.tags };
                }
                if (plugin.config.variables) {
                    config.variables = { ...config.variables, ...plugin.config.variables };
                }
            }
        }

        return config;
    }
} */