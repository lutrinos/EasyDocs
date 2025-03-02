import { ZodSchema } from "zod";
import { log } from "../logger";

export const enforceSchema = <T>(schema: ZodSchema, value: T, error: string) => {
    const result = schema.safeParse(value);

    if (!result.success) {
        log('error', error);
        result.error.issues.forEach((i) => {
            const path = i.path.length > 0 ? ` at "${i.path.join('.')}"` : '';
            log('warn', ` - ${i.code}: ${i.message}${path}`);
        });
    }

    return result;
}

export interface Group {
    url?: string;
    title?: string;
    // ... other existing properties
}

export * from "./group";
export * from "./shared";
export * from "./config";
export * from "./document";