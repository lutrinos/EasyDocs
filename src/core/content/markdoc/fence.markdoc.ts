import Markdoc, { Config, Node, Tag } from "@markdoc/markdoc";
import Prism from "prismjs";

export default {
  render: 'Fence',
  attributes: {
    language: {
      type: String
    },
    theme: {
      type: String
    }
  },
  async transform(node: Node, config: Config) {
    const code = node.transformChildren(config).join('');

    if (node.attributes.language) {
      const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

      return new Tag('Fence', {
        theme: node.attributes.theme ?? config.variables?.prismTheme ?? 'okaida', 
        language: node.attributes.language,
        html: html
      });
    }
    return new Tag('Fence', {
      theme: node.attributes.theme ?? config.variables?.prismTheme ?? 'okaida',
      html: Markdoc.renderers.html(Markdoc.transform(node))
    })
  }
};