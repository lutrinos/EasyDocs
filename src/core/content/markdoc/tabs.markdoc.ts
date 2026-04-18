import { Node, Tag } from '@markdoc/markdoc';

export const tabs = {
  render: 'Tabs',
  attributes: {},
  async transform(node: Node, config: any) {
    const children = await node
      .transformChildren(config);
    
    const labels = children
      .filter((child: any) => child && child.name === 'Tab')
      .map((tab: any) => (typeof tab === 'object' ? tab.attributes.label : null));

    return new Tag(this.render, { labels }, node.transformChildren(config));
  }
};

export const tab = {
  render: 'Tab',
  attributes: {
    label: {
      type: String
    }
  }
};
