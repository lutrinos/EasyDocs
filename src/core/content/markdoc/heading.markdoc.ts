import { nodes, Tag } from '@markdoc/markdoc';

function generateID(children: any[], attributes: { id: any; }) {
  if (attributes.id && typeof attributes.id === 'string') {
    return attributes.id;
  }
  return children
    .filter((child) => typeof child === 'string')
    .join(' ')
    .replace(/[?]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export default {
  ...nodes.heading,
  transform(node: any, config: any) {// @ts-expect-error
    const base = nodes.heading.transform(node, config);// @ts-expect-error
    base.attributes.id = generateID(base.children, base.attributes);// @ts-expect-error
    base.attributes.level = node.attributes.level;// @ts-expect-error
    base.name = 'Heading';
    return base;
  }
};
