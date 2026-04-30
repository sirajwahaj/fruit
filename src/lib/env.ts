import { z } from "zod";

// Validate environment variables lazily (on first access, not at import time)
const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(16),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | undefined;

export function getEnv(): Env {
    if (!_env) {
        const parsed = envSchema.safeParse(process.env);
        if (!parsed.success) {
            console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
            throw new Error("Invalid environment variables");
        }
        _env = parsed.data;
    }
    return _env;
}
