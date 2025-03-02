import type { createElement, ComponentType, Fragment, ReactNode } from 'preact/compat';

type ReactShape = Readonly<{
    createElement: typeof createElement;
    Fragment: typeof Fragment;
}>;

type Component = ComponentType<any>;

export type Primitive = null | boolean | number | string;
export type RenderableTreeNode = Tag | Scalar;
export type Scalar = Primitive | Scalar[] | { [key: string]: Scalar };
export type RenderableTreeNodes = RenderableTreeNode | RenderableTreeNode[];

class Tag<
  N extends string = string,
  A extends Record<string, any> = Record<string, any>
> {
  readonly $$mdtype = 'Tag' as const;

  static isTag = (tag: any): tag is Tag => {
    return !!(tag?.$$mdtype === 'Tag');
  };

  name: N;
  attributes: A;
  children: RenderableTreeNode[];

  constructor(
    name = 'div' as N,
    attributes = {} as A,
    children: RenderableTreeNode[] = []
  ) {
    this.name = name;
    this.attributes = attributes;
    this.children = children;
  }
}

function tagName(
    name: string,
    components: Record<string, Component> | ((string: string) => Component)
): string | Component {
    return typeof name !== 'string'
        ? name // This can be an object, e.g. when React.forwardRef is used
        : name[0] !== name[0].toUpperCase()
            ? name
            : components instanceof Function
                ? components(name)
                : components[name];
}

export type RenderOpts = {
    components?: Record<string, Component> | ((string: string) => Component);
    resolveTagName?: typeof tagName;
};
export default function markdoc(
    node: RenderableTreeNodes,
    React: ReactShape,
    { components = {}, resolveTagName = tagName }: RenderOpts = {}
) {
    function deepRender(value: any): any {
        if (value == null || typeof value !== 'object') return value;

        if (Array.isArray(value)) return value.map((item) => deepRender(item));

        if (value.$$mdtype === 'Tag') return render(value);

        if (typeof value !== 'object') return value;

        const output: Record<string, Scalar> = {};
        for (const [k, v] of Object.entries(value)) output[k] = deepRender(v);
        return output;
    }

    function render(node: RenderableTreeNodes): ReactNode {
        if (Array.isArray(node))
            return React.createElement(React.Fragment, null, ...node.map(render));

        if (node === null || typeof node !== 'object' || !Tag.isTag(node))
            return node;

        const {
            name,
            attributes: { class: className, ...attrs } = {},
            children = [],
        } = node;

        if (className) attrs.className = className;


        return React.createElement(
            // @ts-ignore
            resolveTagName(name, components),
            Object.keys(attrs).length == 0 ? null : deepRender(attrs),
            ...children.map(render)
        );
    }

    return render(node);
}