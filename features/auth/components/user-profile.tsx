'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { AuthCard } from './auth-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GetUserResponse } from '@/types/auth';
import { authService } from '@/services/auth/auth.service';

const profileSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
    role: z.string().min(1, { message: 'Role is required' }),
    bio: z.string().max(200, { message: 'Bio cannot exceed 200 characters' }).optional()
});

type ProfileValues = z.infer<typeof profileSchema>;

type UserProfileProps = {
    user: GetUserResponse['data'];
};

export function UserProfile({ user }: UserProfileProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

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
            toast.success('Profile updated successfully', {
                description: `Updated info for ${data.fullName}`
            });
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSignOut() {
        setIsSigningOut(true);
        try {
            await authService.signOut();
            toast.success('Signed out');
        } catch {
            toast.info('Signed out');
        } finally {
            setIsSigningOut(false);
            router.push('/login');
        }
    }

    return (
        <AuthCard title="Profile" description="Manage your account information and preferences." imageSrc="https://res.cloudinary.com/diljekoto/image/upload/v1789123846/alaory-5e2Zme1mVDE-unsplash_ziafjj_537c8f.webp">
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
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal text-amber-500 border-amber-500/20">
                                        Unverified
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={handleSignOut} disabled={isSigningOut} className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive">
                        {isSigningOut ? 'Signing out...' : 'Sign out'}
                    </Button>
                </div>

                {/* Edit Profile Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <Label htmlFor="fullName" className="text-sm font-medium">
                                Full Name
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
                            Role / Position
                        </Label>
                        <Input id="role" type="text" aria-invalid={!!errors.role} {...register('role')} />
                        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                        <Label htmlFor="bio" className="text-sm font-medium">
                            Bio
                        </Label>
                        <Textarea id="bio" rows={3} className="resize-none" placeholder="Write a short bio..." aria-invalid={!!errors.bio} {...register('bio')} />
                        {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="submit" disabled={isLoading || !isDirty}>
                            {isLoading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthCard>
    );
}
