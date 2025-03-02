import z, { object } from "zod";

export const docSchema = object({
    id: z.string().optional(),
    url: z.string().optional(),

    slug: z.string().optional(),
    title: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    icon: z.string().optional(),
    breadcrumb: z.boolean().optional(),
    categories: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    order: z.number().optional(),
    visibility: z.enum(['visible', 'draft', 'hidden']).optional(),
    redirect: z.string().url().optional(),
    layout: z.enum(['document', 'blog']).optional(),
    edit: z.boolean().optional()
});

export type DocConfig = z.infer<typeof docSchema>;