'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { AuthCard } from './auth-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GetUserResponse } from '@/types/auth';
import { authService } from '@/services/auth/auth.service';

type UserProfileProps = {
    user: GetUserResponse['data'];
};

export function UserProfile({ user }: UserProfileProps) {
    const t = useTranslations('Auth.Me');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const profileSchema = z.object({
        fullName: z.string().min(2, { message: t('fullNameRequired') }),
        email: z
            .string()
            .min(1, { message: t('emailRequired') })
            .email({ message: t('emailInvalid') }),
        role: z.string().min(1, { message: t('roleRequired') }),
        bio: z
            .string()
            .max(200, { message: t('bioMax') })
            .optional()
    });

    type ProfileValues = z.infer<typeof profileSchema>;

    const userInitials = (user.name || 'U')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const userRoles = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles.join(', ') : 'User';

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user.name || '',
            email: user.email || '',
            role: userRoles,
            bio: 'Software developer crafting web applications.'
        }
    });

    async function onSubmit(data: ProfileValues) {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            toast.success(t('updateSuccess'), {
                description: t('updatedInfoFor', { name: data.fullName })
            });
        } catch {
            toast.error(t('updateError'));
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSignOut() {
        setIsSigningOut(true);
        try {
            await authService.signOut();
            toast.success(t('signOutSuccess'));
        } catch {
            toast.info(t('signOutSuccess'));
        } finally {
            setIsSigningOut(false);
            router.push('/sign-in'); // Redirecting back to /sign-in using our routing
        }
    }

    return (
        <AuthCard title={t('title')} description={t('description')} imageSrc="https://res.cloudinary.com/diljekoto/image/upload/v1789123846/alaory-5e2Zme1mVDE-unsplash_ziafjj_537c8f.webp">
            <div className="space-y-6">
                {/* User Avatar Summary Header */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border-2 border-border">
                    <div className="flex items-center gap-3">
                        <Avatar size="lg" className="size-12 border-2 border-border">
                            <AvatarImage src={user.image || undefined} alt={user.name} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground text-sm">{user.name}</h3>
                                {user.verifiedAt ? (
                                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                        {t('verified')}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal text-amber-500 border-amber-500/20">
                                        {t('unverified')}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={handleSignOut} disabled={isSigningOut} className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive">
                        {isSigningOut ? t('signingOut') : t('signOut')}
                    </Button>
                </div>

                {/* Edit Profile Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <Label htmlFor="fullName" className="text-sm font-medium">
                                {t('fullName')}
                            </Label>
                            <Input id="fullName" type="text" aria-invalid={!!errors.fullName} {...register('fullName')} />
                            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input id="email" type="email" aria-invalid={!!errors.email} {...register('email')} />
                            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-1">
                        <Label htmlFor="role" className="text-sm font-medium">
                            {t('role')}
                        </Label>
                        <Input id="role" type="text" aria-invalid={!!errors.role} {...register('role')} />
                        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                        <Label htmlFor="bio" className="text-sm font-medium">
                            {t('bio')}
                        </Label>
                        <Textarea id="bio" rows={3} className="resize-none" placeholder={t('bioPlaceholder')} aria-invalid={!!errors.bio} {...register('bio')} />
                        {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="submit" disabled={isLoading || !isDirty}>
                            {isLoading ? t('saving') : t('saveChanges')}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthCard>
    );
}
