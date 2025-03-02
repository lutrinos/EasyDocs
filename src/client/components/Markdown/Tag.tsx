export type Primitive = null | boolean | number | string;
export type RenderableTreeNode = Tag | Scalar;
export type Scalar = Primitive | Scalar[] | { [key: string]: Scalar };
export type RenderableTreeNodes = RenderableTreeNode | RenderableTreeNode[];

export default class Tag<
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