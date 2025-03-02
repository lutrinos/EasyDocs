/*import { Plugin } from './index';
import hljs from 'highlight.js';
import Markdoc from '@markdoc/markdoc';
import { ParsedContent } from '../../types';

const plugin: Plugin = {
    name: 'code-highlight',
    config: {
        nodes: {
            fence: {
                render: 'CodeBlock',
                attributes: {
                    language: { type: String },
                    content: { type: String }
                }
            }
        }
    },
    transform: async (content: ParsedContent) => {
        // No need to transform the content directly
        // Markdoc will handle it through the config
        return content;
    }
};

// Custom React component for code blocks
export function CodeBlock({ language, content }: { language?: string; content: string }) {
    const validLanguage = hljs.getLanguage(language || '') ? language : 'plaintext';
    const highlighted = hljs.highlight(content, { language: validLanguage || 'plaintext' }).value;

    return (
        <pre>
            <code className={`hljs language-${validLanguage}`} 
                  dangerouslySetInnerHTML={{ __html: highlighted }} 
            />
        </pre>
    );
}

export default plugin; */