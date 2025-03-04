

export interface Plugin {
    name: string;
    stage: 'pre' | 'post';
    priority: number;
    transform: (content: string) => Promise<string>;
}

export class PluginManager {
    private plugins: Plugin[] = [];

    register(plugin: Plugin) {
        this.plugins.push(plugin);
        this.plugins.sort((a, b) => {
            return a.priority - b.priority;
        });
    }

    async process(content: string): Promise<string> {
        let result = content;
        
        for (const plugin of this.plugins) {
            result = await plugin.transform(result);
        }
        
        return result;
    }
}