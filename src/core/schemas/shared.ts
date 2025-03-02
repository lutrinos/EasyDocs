import z from "zod";

export const status = z.enum(['alpha', 'beta', 'archived', 'previous', 'current']);

export const visibility = z.enum(['visible', 'draft', 'hidden']);

export const link = z.object({
    url: z.string().url(),
    title: z.string()
});

export type Visibility = z.infer<typeof visibility>;
export type Link = z.infer<typeof link>;
export type Status = z.infer<typeof status>;