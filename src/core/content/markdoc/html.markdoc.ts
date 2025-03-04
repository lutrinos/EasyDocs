import { format, Node, Tag } from "@markdoc/markdoc";

const prepare = (v: string) => {
    return v.substring(v.indexOf('}') + 1, v.lastIndexOf('{'));
}

export const html = {
    attributes: {
        tag: { type: String },
    },
    transform(node: Node, config: any) {
        return new Tag(node.attributes.tag ?? 'div', { dangerouslySetInnerHTML: { __html: prepare(format(node)) } });
    }
};