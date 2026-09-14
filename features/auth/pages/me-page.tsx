import React from 'react';
import { redirect } from '@/i18n/routing';
import { authService } from '@/services/auth/auth.service';
import { UserProfile } from '../components/user-profile';
import { GetUserResponse } from '@/types/auth';

export default async function MePage({ params }: { params: Promise<{ locale: string }> }) {
    let user: GetUserResponse['data'] | null = null;
    const { locale } = await params;

    try {
        user = await authService.getMe();
    } catch {
        redirect({ href: '/sign-in', locale });
    }

    if (user === null) {
        redirect({ href: '/sign-in', locale });
    } else {
        return <UserProfile user={user} />;
    }
}
