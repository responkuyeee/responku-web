'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth/auth.service';
import { ApiException } from '@/services/types';
import { AuthCard } from './auth-card';

export function SignUpForm() {
    const t = useTranslations('Auth.SignUp');
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const signUpSchema = z
        .object({
            fullName: z.string().min(2, { message: t('fullNameRequired') }),
            email: z
                .string()
                .min(1, { message: t('emailRequired') })
                .email({ message: t('emailInvalid') }),
            password: z.string().min(8, { message: t('passwordMin') }),
            confirmPassword: z.string().min(1, { message: t('confirmPassword') }),
            terms: z.boolean().refine(val => val === true, {
                message: t('termsRequired')
            })
        })
        .refine(data => data.password === data.confirmPassword, {
            message: t('passwordsNotMatch'),
            path: ['confirmPassword']
        });

    type SignUpValues = z.infer<typeof signUpSchema>;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false
        }
    });

    async function onSubmit(params: SignUpValues) {
        setIsLoading(true);
        try {
            await authService.signUp({
                name: params.fullName,
                email: params.email,
                password: params.password,
                providerId: 'credentials'
            });
            toast.success(t('success'));
            router.push(`/email-verification?email=${encodeURIComponent(params.email)}`);
        } catch (exception) {
            if (exception instanceof ApiException) {
                toast.error(exception.message || t('error'));
            } else {
                toast.error(t('error'));
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard title={t('title')} description={t('description')} imageSrc="https://res.cloudinary.com/diljekoto/image/upload/v1789123849/nour-betar-BFazlw6s0N8-unsplash_nhd6pf_51140e.webp">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                        {t('fullName')}
                    </Label>
                    <Input id="fullName" type="text" placeholder={t('fullNamePlaceholder')} aria-invalid={!!errors.fullName} {...register('fullName')} />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm font-medium">
                        {t('email')}
                    </Label>
                    <Input id="email" type="email" placeholder={t('emailPlaceholder')} aria-invalid={!!errors.email} {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm font-medium">
                            {t('password')}
                        </Label>
                        <div className="relative">
                            <Input id="password" type={showPassword ? 'text' : 'password'} placeholder={t('passwordPlaceholder')} className="pr-10" aria-invalid={!!errors.password} {...register('password')} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            {t('confirmPassword')}
                        </Label>
                        <div className="relative">
                            <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder={t('passwordPlaceholder')} className="pr-10" aria-invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-1">
                    <div className="flex items-center space-x-2">
                        <Controller name="terms" control={control} render={({ field }) => <Checkbox id="terms" checked={!!field.value} onCheckedChange={checked => field.onChange(!!checked)} />} />
                        <Label htmlFor="terms" className="text-xs text-muted-foreground font-normal cursor-pointer">
                            {t('terms')}
                        </Label>
                    </div>
                    {errors.terms && <p className="text-xs text-destructive mt-1">{errors.terms.message}</p>}
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
                <p className="text-center text-xs text-muted-foreground pt-3">
                    {t('haveAccount')}{' '}
                    <Link href="/sign-in" className="text-primary font-medium hover:underline">
                        {t('signIn')}
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
