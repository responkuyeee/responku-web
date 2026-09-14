'use server';

import { cookies } from 'next/headers';

/**
 * Retrieves the value of a specific cookie by its name.
 * This is a server-side utility function that uses the Next.js `cookies` API.
 * 
 * @param {Object} params - The parameters object.
 * @param {string} params.cookieName - The name of the cookie to retrieve.
 * @returns {Promise<string | null>} A promise that resolves to the cookie value if found, or null otherwise.
 */
export async function getCookie({ cookieName }: { cookieName: string }): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(cookieName);
    return cookie?.value ?? null;
}
