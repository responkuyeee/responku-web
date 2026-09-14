'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AuthCard } from './auth-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { authService } from '@/services/auth/auth.service';
import { ApiException } from '@/services/types';

export function SignInForm() {
    const t = useTranslations('Auth.SignIn');
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const signInSchema = z.object({
        email: z.string().min(1, { message: t('emailRequired') }).email({ message: t('emailInvalid') }),
        password: z.string().min(1, { message: t('passwordRequired') }).min(8, { message: t('passwordMin') }),
        rememberMe: z.boolean().default(false).optional()
    });

    type SignInValues = z.infer<typeof signInSchema>;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    });

    async function onSubmit(data: SignInValues) {
        setIsLoading(true);
        try {
            await authService.signIn({
                email: data.email,
                password: data.password,
                providerId: 'credentials'
            });
            toast.success(t('success'));
            router.push('/me');
        } catch (exception) {
            if (exception instanceof ApiException) {
                const messageLower = (exception.message || '').toLowerCase();
                const isUnverified = exception.statusCode === 401 && messageLower.includes('email not verified');
                if (isUnverified) {
                    toast.info(exception.message || t('emailNotVerified'));
                    router.push(`/email-verification?email=${encodeURIComponent(data.email)}`);
                } else {
                    toast.error(exception.message || t('error'));
                }
            } else {
                toast.error(t('error'));
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard title={t('title')} description={t('description')} imageSrc="https://res.cloudinary.com/diljekoto/image/upload/v1789123854/cat_okyo6p_51140e.webp">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm font-medium">
                        {t('email')}
                    </Label>
                    <Input id="email" type="email" placeholder={t('emailPlaceholder')} aria-invalid={!!errors.email} {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                            {t('password')}
                        </Label>
                        <a
                            href="#forgot"
                            onClick={e => {
                                e.preventDefault();
                                toast.info('Forgot password clicked');
                            }}
                            className="text-xs text-primary hover:underline"
                        >
                            {t('forgotPassword')}
                        </a>
                    </div>
                    <div className="relative">
                        <Input id="password" type={showPassword ? 'text' : 'password'} placeholder={t('passwordPlaceholder')} className="pr-10" aria-invalid={!!errors.password} {...register('password')} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2 pt-1">
                    <Controller name="rememberMe" control={control} render={({ field }) => <Checkbox id="rememberMe" checked={!!field.value} onCheckedChange={checked => field.onChange(!!checked)} />} />
                    <Label htmlFor="rememberMe" className="text-xs text-muted-foreground font-normal cursor-pointer">
                        {t('rememberMe')}
                    </Label>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? t('submitting') : t('submit')}
                </Button>

                {/* Social Login */}
                <div className="grid grid-cols-1 gap-3">
                    <Button type="button" variant="outline" onClick={() => toast.info('Google login initiated')} className="w-full text-xs font-medium">
                        Google
                    </Button>
                </div>

                {/* Link */}
                <p className="text-center text-xs text-muted-foreground pt-4">
                    {t('noAccount')}{' '}
                    <Link href="/sign-up" className="text-primary font-medium hover:underline">
                        {t('signUp')}
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
