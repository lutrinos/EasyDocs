import { object, string, z } from "zod";

export const groupSchema = object({
    title: string(),
    slug: string(),
    url: string().url().optional()
});

export type GroupConfig = z.infer<typeof groupSchema>;