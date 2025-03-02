import { GroupConfig, DocConfig } from '@core/schemas';
import { joinURL } from './strings';

interface BaseNode {
    type: NodeType;
    url: string;
}

interface GroupNode extends BaseNode {
    type: 'group';
    config: GroupConfig;
    children: Map<string, TreeNode>;
}

interface DocumentNode extends BaseNode {
    type: 'document';
    config: DocConfig;
}

type TreeNode = GroupNode | DocumentNode;
type NodeType = 'group' | 'document';

// Add interfaces for JSON output
interface BaseNodeJSON {
    type: NodeType;
    url: string;
    title: string;
}

interface GroupNodeJSON extends BaseNodeJSON {
    type: 'group';
    children: Record<string, TreeNodeJSON>;
}

interface DocumentNodeJSON extends BaseNodeJSON {
    type: 'document';
}

type TreeNodeJSON = GroupNodeJSON | DocumentNodeJSON;

export default class Tree {
    private root: GroupNode = {
        type: 'group',
        url: '/',
        config: {
            title: 'Home',
            slug: ''
        },
        children: new Map()
    };

    add(path: string[], type: NodeType, url: string, config: GroupConfig | DocConfig) {
        if (path.length === 0 && type === 'group') {
            this.root.config = config as GroupConfig;
            return;
        }

        let current = this.root;

        for (let i = 0; i < path.length - 1; i++) {
            const segment = path[i];
            
            if (!current.children.has(segment)) {
                current.children.set(segment, {
                    type: 'group',
                    url: joinURL(current.url, segment),
                    config: {
                        title: segment,
                        slug: segment
                    },
                    children: new Map()
                });
            }
            
            current = current.children.get(segment) as GroupNode;
        }

        // The final node
        const lastSegment = path[path.length - 1];
        if (type === 'group') {
            current.children.set(lastSegment, {
                type: 'group',
                url,
                config: config as GroupConfig,
                children: new Map()
            });
        } else {
            current.children.set(lastSegment, {
                type: 'document',
                url,
                config: config as DocConfig
            });
        }
    }

    update(path: string[], config: GroupConfig | DocConfig) {
        const node = this.find(path);
        if (node) {
            node.config = config;
            return true;
        }
        return false;
    }

    updateUrl(path: string[], newUrl: string) {
        const node = this.find(path);
        if (!node) return false;

        node.url = newUrl;

        // If it's a group, recursively update children URLs
        if (node.type === 'group') {
            for (const [childName, child] of node.children) {
                const childNewUrl = `${newUrl}${childName}/`;
                if (child.type === 'group') {
                    this.updateUrl([...path, childName], childNewUrl);
                } else {
                    child.url = childNewUrl;
                }
            }
        }

        return true;
    }

    find(path: string[]): TreeNode | undefined {
        let current: TreeNode = this.root;

        for (const segment of path) {
            if (current.type !== 'group') {
                return undefined;
            }
            
            const next = current.children.get(segment);
            if (!next) {
                return undefined;
            }
            current = next;
        }

        return current;
    }

    /**
     * Removes a node at the specified path
     * @returns true if node was found and removed, false otherwise
     */
    remove(path: string[]): boolean {
        if (path.length === 0) {
            return false; // Cannot remove root node
        }

        const parentPath = path.slice(0, -1);
        const lastSegment = path[path.length - 1];
        
        const parent = this.find(parentPath);
        
        if (!parent || parent.type !== 'group') {
            return false;
        }

        return parent.children.delete(lastSegment);
    }

    /**
     * Converts the tree to a JSON-serializable format
     */
    toJSON(): GroupNodeJSON {
        return this.nodeToJSON(this.root) as GroupNodeJSON;
    }

    /**
     * Recursively converts a node to JSON format
     */
    private nodeToJSON(node: TreeNode): TreeNodeJSON {
        const base = {
            type: node.type,
            url: node.url,
            title: node.config.title || this.getDefaultTitle(node)
        };

        if (node.type === 'group') {
            const children: Record<string, TreeNodeJSON> = {};
            
            // Convert Map to object and sort by title
            const sortedEntries = Array.from(node.children.entries())
                .sort(([, a], [, b]) => {
                    const titleA = a.config.title || this.getDefaultTitle(a);
                    const titleB = b.config.title || this.getDefaultTitle(b);
                    return titleA.localeCompare(titleB);
                });

            for (const [key, child] of sortedEntries) {
                children[key] = this.nodeToJSON(child);
            }

            return {
                ...base,
                type: 'group',
                children
            };
        }

        return {
            ...base,
            type: 'document'
        };
    }

    /**
     * Generates a default title from the URL if none is provided
     */
    private getDefaultTitle(node: TreeNode): string {
        if (node.url === '/') return 'Home';
        
        // Get the last part of the URL (excluding trailing slash)
        const parts = node.url.split('/').filter(Boolean);
        const lastPart = parts[parts.length - 1];
        
        // Convert kebab-case to Title Case
        return lastPart
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}