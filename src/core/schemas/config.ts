import z, { object, string } from "zod"
import { status, visibility } from "@core/schemas/shared";

// Version schema for documentation versioning
export const version = z.object({
  status: status.default('current'),
  title: string(),
  description: string().optional(),
  slug: string()
});

// Main configuration schema
export const configSchema = z.object({
  // Basic site configuration
  title: z.string().default("EasyDocs"),
  baseUrl: z.string().default('/'),
  
  // Repository and editing settings
  repository: string().url().default('https://github.com/lutrinos/EasyDocs'),
  remote: string().url().optional(),
  
  // Theme and display settings
  theme: z.object({
    primaryColor: string().optional(),
    darkMode: z.boolean().default(true),
    font: string().optional(),
    customCSS: z.array(string()).optional(),
  }).optional(),

  // SEO settings
  seo: z.object({
    title: string().default('{{ title }} | {{ page.title }}'),
    description: string().optional(),
    favicon: string().default('favicon.ico'),
    tagLine: string().optional()
    
  }).optional(),

  // Template and rendering
  ssrTemplate: string().optional(),
  titleDelimiter: string().optional().default('|'),
  defaultVisibility: visibility.optional().default('visible'),
  defaultEdit: z.boolean().optional().default(false),
  
  // Client-side functionality
  clientScripts: z.array(z.string()).optional(),
  search: z.object({
    enabled: z.boolean().default(true),
    type: z.enum(['basic', 'algolia']).default('basic'),
    algolia: z.object({
      appId: string(),
      apiKey: string(),
      indexName: string(),
    }).optional(),
  }).optional(),

  // Edit functionality configuration
  edit: z.object({
    enabled: z.boolean().default(true),
    src: z.string(),
    title: z.string(),
    branch: string().default('main'),
  }).optional(),

  // Navigation and structure
  breadcrumb: z.object({
    enabled: z.boolean().default(true),
    root: z.string().default('Home'),
    icon: z.string().optional(),
    separator: z.string().default('/')
  }).optional(),

  // Sidebar configuration
  sidebar: z.object({
    enabled: z.boolean().default(true),
    collapsible: z.boolean().default(true),
    defaultCollapsed: z.boolean().default(false),
  }).optional(),

  // Internationalization
  i18n: z.object({
    default: z.string().optional(),
    languages: z.array(z.object({
      locale: string(),
      name: string(),
      direction: z.enum(['ltr', 'rtl']).default('ltr'),
    })),
  }).optional(),

  // Footer configuration
  footer: z.object({
    enabled: z.boolean().default(true),
    copyright: string().optional(),
    links: z.array(z.object({
      title: string(),
      items: z.array(z.object({
        label: string(),
        href: string(),
      })),
    })).optional(),
  }).optional(),

  // Analytics integrations
  analytics: z.object({
    googleAnalytics: z.object({
      trackingId: string(),
    }).optional(),
    plausible: z.object({
      domain: string(),
    }).optional(),
  }).optional(),
});

export type EasyDocsConfig = z.infer<typeof configSchema>;
export type Version = z.infer<typeof version>;