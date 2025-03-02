/// <reference types="preact" />

import { Group, Doc } from "./core/schemas/group";

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}






/**
 * Old things
 */

type EasyDocsBanner = {
  title: string;
}

/**
 * Some generic types
 */
type FilePath = string;
type FileUrl = string;

type UpdateEvent = {
  url: string;
  path: string;
};

type LanguageConfig = {
  title?: string;
  slug?: string;
};

/**
 * Types for the services
 * **/
type ASTBase = {
  path: string;
  absolutePath: string;
  meta: Record<string, string>;
};

type ASTFolder = Base & {
  type: 0;
  children: FolderOrFile[];
};

type ASTFile = Base & {
  type: 1;
  content: string;
  extension: string;
  name: string;
};

type FolderOrFile = ASTFile | ASTFolder;

type FrontMeta = {
  id?: string;
  slug?: string;

  title?: string;
  description?: string;

  icon?: string;
  breadcrumb?: boolean;

  categories?: string[];
  keywords?: string[];

  order?: number;
  visibility?: 'visible' | 'draft' | 'hidden';
  redirect?: string;
};

type ASTGroup = {
  type: 0;
  url: string;
  path: string;
  groups: string[];
  documents: string[];
  meta: FrontMeta;
};

type ASTDocument = {
  type: 1;
  content: string;
  url: string;
  path: string;
  meta: FrontMeta & {
    image?: string;

    date?: Date;

    authors?: string[];

    layout?: 'document' | 'blog';
    edit?: boolean;
  };
};

type TransformResult = {
  groups: Map<string, ASTGroup>;
  documents: Map<string, ASTDocument>;
  converter: Map<string, string>;
  stack: Map<string, (ASTDocument | ASTGroup)[]>;
};