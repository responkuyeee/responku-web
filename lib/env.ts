import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

/**
 * Application environment variables configuration and validation.
 * Uses `@t3-oss/env-core` and `zod` to ensure type safety for both client and server environments.
 */
export const env = createEnv({
    clientPrefix: 'NEXT_PUBLIC_',
    server: {},
    client: {
        NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),
        NEXT_PUBLIC_SESSION_COOKIE_NAME: z.string().default('nestsession'),
        NEXT_PUBLIC_CLOUDINARY_MAX_FILE_UPLOAD: z.string().default('10485760'),
        NEXT_PUBLIC_GOOGLE_TOKEN_EXCHANGE_COOKIE_NAME: z.string().default('oauth_google_state')
    },
    /**
     * What object holds the environment variables at runtime. This is usually
     * `process.env` or `import.meta.env`.
     */
    runtimeEnv: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SESSION_COOKIE_NAME: process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME,
        NEXT_PUBLIC_CLOUDINARY_MAX_FILE_UPLOAD: process.env.NEXT_PUBLIC_CLOUDINARY_MAX_FILE_UPLOAD,
        NEXT_PUBLIC_GOOGLE_TOKEN_EXCHANGE_COOKIE_NAME: process.env.NEXT_PUBLIC_GOOGLE_TOKEN_EXCHANGE_COOKIE_NAME
    },
    emptyStringAsUndefined: true
});
