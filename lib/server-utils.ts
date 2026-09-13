'use server';

import { cookies } from 'next/headers';

export async function getCookie({ cookieName }: { cookieName: string }): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(cookieName);
    return cookie?.value ?? null;
}
