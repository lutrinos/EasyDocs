/*import Path from 'path';

type SortingFunctions = {
  sortDocuments?: (doc1: ASTDocument, doc2: ASTDocument) => number;
  sortGroups?: (group1: ASTGroup, group2: ASTGroup) => number;
  sortPaths?: <T extends ASTDocument | ASTGroup>(item1: T, item2: T) => number;
};

type TreeItem = ASTDocument | ASTGroup;

export class Tree {
  private groups: Map<FileUrl, FilePath[]>;
  private documents: Map<FileUrl, FilePath[]>;
  private tree: Map<FilePath, TreeItem>;
  private sortFns: Required<SortingFunctions>;

  constructor(items: TreeItem[], sortingFn: SortingFunctions = {}) {
    this.groups = new Map();
    this.documents = new Map();
    this.tree = new Map();

    // Initialize sorting functions with defaults
    this.sortFns = {
      sortDocuments: sortingFn.sortDocuments ?? ((_, __) => 0),
      sortGroups: sortingFn.sortGroups ?? ((_, __) => 0),
      sortPaths: sortingFn.sortPaths ?? ((_, __) => 0),
    };

    // Initialize tree with items
    items.forEach(item => this.pushItem(item));
    this.sortAllItems();
  }

  private sortAllItems(): void {
    // Sort groups
    for (const [, paths] of this.groups) {
      paths.sort((a, b) => this.sortFns.sortPaths(
        this.tree.get(a)!,
        this.tree.get(b)!
      ));
    }

    // Sort documents and groups within each group
    for (const item of this.tree.values()) {
      if (item.type === 0) {
        item.documents.sort((a, b) => this.sortFns.sortDocuments(
          this.tree.get(a) as ASTDocument,
          this.tree.get(b) as ASTDocument
        ));
        item.groups.sort((a, b) => this.sortFns.sortGroups(
          this.tree.get(a) as ASTGroup,
          this.tree.get(b) as ASTGroup
        ));
      }
    }
  }

  private pushItem(item: TreeItem, addToParent: boolean = false): void {
    const map = item.type === 0 ? this.groups : this.documents;
    const paths = map.get(item.url) ?? [];
    
    this.tree.set(item.path, item);
    paths.push(item.path);
    paths.sort((a, b) => this.sortFns.sortPaths(
      this.tree.get(a)!,
      this.tree.get(b)!
    ));
    map.set(item.url, paths);

    if (addToParent) {
      this.addToParent(item);
    }
  }

  private addToParent(item: TreeItem): void {
    const parentPath = this.getParentPath(item.path);
    const parent = parentPath ? this.tree.get(parentPath) as ASTGroup : undefined;

    if (parent?.type === 0) {
      const collection = item.type === 0 ? parent.groups : parent.documents;
      collection.push(item.path);
      collection.sort((a, b) => item.type === 0 
        ? this.sortFns.sortGroups(this.tree.get(a) as ASTGroup, this.tree.get(b) as ASTGroup)
        : this.sortFns.sortDocuments(this.tree.get(a) as ASTDocument, this.tree.get(b) as ASTDocument)
      );
      //this.tree.set(parentPath, parent);
    }
  }

  private removePath(item: TreeItem): void {
    const map = item.type === 0 ? this.groups : this.documents;
    const paths = map.get(item.url)?.filter(p => p !== item.path);
    
    if (!paths?.length) {
      map.delete(item.url);
    } else {
      map.set(item.url, paths);
    }
  }

  private formatURL(url: string): string {
    return url.replace(/(?:\/+)(\/|$)/g, '$1');
  }

  private formatSegments(segments: string[]): string {
    return `/${segments.join('/')}`;
  }

  getSegments(url: string): string[] {
    return url.split('/').slice(1);
  }

  getParentPath(path: FilePath): string | undefined {
    return Path.dirname(path);
  }

  private updateURL(item: TreeItem, newUrl: FileUrl): boolean {
    if (item.url === newUrl) return true;

    if (item.type === 0) {
      const oldSegments = this.getSegments(item.url);
      const newSegments = this.getSegments(newUrl);

      if (oldSegments.length !== newSegments.length) return false;

      const diffIndex = oldSegments.findIndex((seg, i) => seg !== newSegments[i]);
      if (diffIndex === -1) return true;

      const updateGroupUrls = (group: ASTGroup): void => {
        this.removePath(group);
        group.url = this.replaceUrlSegment(group.url, diffIndex, newSegments[diffIndex]);
        this.pushItem(group);

        group.documents.forEach(docPath => {
          const doc = this.tree.get(docPath) as ASTDocument;
          if (doc) this.updateURL(doc, this.replaceUrlSegment(doc.url, diffIndex, newSegments[diffIndex]));
        });

        group.groups.forEach(groupPath => {
          const subGroup = this.tree.get(groupPath) as ASTGroup;
          if (subGroup) updateGroupUrls(subGroup);
        });
      };

      updateGroupUrls(item);
    } else {
      this.removePath(item);
      item.url = newUrl;
      this.pushItem(item);
    }

    return true;
  }

  private replaceUrlSegment(url: string, index: number, newSegment: string): string {
    const segments = this.getSegments(url);
    segments[index] = newSegment;
    return '/' + segments.join('/');
  }

  getDocument(url: FileUrl): ASTDocument | undefined {
    const path = this.documents.get(url);

    if (path && path.length > 0) {
      const doc = this.tree.get(path[0]);

      if (doc && doc.type === 1) {
        return doc;
      }
    }

    return;
  }

  getGroup(url: FileUrl): ASTGroup | undefined {
    const path = this.groups.get(url);

    if (path && path.length > 0) {
      const doc = this.tree.get(path[0]);

      if (doc && doc.type === 0) {
        return doc;
      }
    }

    return;
  }

  getPath(path: FilePath): ASTDocument | ASTGroup | undefined {
    return this.tree.get(path);
  }

  getURL(path: FilePath): string | undefined {
    return this.tree.get(path)?.url;
  }

  update(path: FilePath, data: Partial<TreeItem>): boolean {
    const item = this.tree.get(path);
    if (!item) return false;

    if (data.url && data.url !== item.url) {
      this.updateURL(item, data.url);
    }

    //this.tree.set(path, { ...item, ...data, type: item.type });
    return true;
  }

  remove(path: FilePath): boolean {
    const item = this.tree.get(path);
    if (!item) return false;

    const parent = this.getParentPath(path);
    if (parent) {
      const parentGroup = this.tree.get(parent) as ASTGroup;
      if (parentGroup?.type === 0) {
        const collection = item.type === 0 ? parentGroup.groups : parentGroup.documents;
        parentGroup[item.type === 0 ? 'groups' : 'documents'] = collection.filter(p => p !== path);
        this.tree.set(parent, parentGroup);
      }
    }

    if (item.type === 0) {
      [...item.documents, ...item.groups].forEach(p => this.remove(p));
    }

    this.removePath(item);
    this.tree.delete(path);
    return true;
  }

  addDocument(document: ASTDocument): void {
    this.pushItem(document, true);
  }

  addGroup(group: ASTGroup): void {
    this.pushItem(group, true);
  }
}
*/