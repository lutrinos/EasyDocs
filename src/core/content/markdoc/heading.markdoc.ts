import { Node, Tag } from '@markdoc/markdoc';

function generateContent(children: any[], attributes: any) {
  const content = children
    .filter((child) => typeof child === 'string')
    .join(' ');

  if (attributes.id && typeof attributes.id === 'string') {
    return [content, attributes.id];
  }
  

  return [
    content,
    content.replace(/[?]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
  ];
}

export default {
  children: ['inline'],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 }
  },
  async transform(node: Node, config: any) {
    const children = await node.transformChildren(config);
    const attributes = node.transformAttributes(config);

    const [label, id] = generateContent(children, attributes);

    return new Tag('Heading', {
      id,
      label,
      ...attributes
    }, children);
  }
};
