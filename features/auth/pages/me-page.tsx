import React from 'react';
import { redirect } from 'next/navigation';
import { authService } from '@/services/auth/auth.service';
import { UserProfile } from '../components/user-profile';
import { GetUserResponse } from '@/types/auth';

export default async function MePage() {
    let user: GetUserResponse['data'];

    try {
        user = await authService.getMe();
    } catch {
        redirect('/login');
    }

    return <UserProfile user={user} />;
}
