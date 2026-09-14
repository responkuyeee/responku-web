'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Clock, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth/auth.service';
import { ApiException } from '@/services/types';
import { AuthCard } from './auth-card';
import { cn } from '@/lib/utils';

function EmailVerificationFormContent() {
    const t = useTranslations('Auth.EmailVerification');
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const otpSchema = z.object({
        code: z.string().min(6, { message: t('invalidCode') }).max(6, { message: t('invalidCode') })
    });
    
    type OTPValues = z.infer<typeof otpSchema>;

    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const {
        handleSubmit,
        control,
        setError,
        formState: { errors }
    } = useForm<OTPValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            code: ''
        }
    });

    async function onSubmit(data: OTPValues) {
        if (!email) {
            toast.error(t('missingEmail'));
            return;
        }

        setIsLoading(true);
        try {
            await authService.confirmVerification({
                email,
                otp: data.code
            });
            toast.success(t('success'));
            router.push('/sign-in'); // Redirect back to sign-in on success
        } catch (exception) {
            setError('code', {
                type: 'manual',
                message: t('invalidOtp')
            });
            if (exception instanceof ApiException) {
                toast.error(exception.message || t('invalidOtp'));
            } else {
                toast.error(t('invalidOtp'));
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResendCode() {
        if (!email) {
            toast.error(t('missingEmailResend'));
            return;
        }

        setIsResending(true);
        try {
            await authService.resendVerification({ email });
            toast.success(t('resendSuccess', { email }));
        } catch (exception) {
            if (exception instanceof ApiException) {
                toast.error(exception.message || t('resendError'));
            } else {
                toast.error(t('resendError'));
            }
        } finally {
            setIsResending(false);
        }
    }

    return (
        <AuthCard
            title={t('title')}
            description={email ? t('description') : t('description')}
            imageSrc="https://res.cloudinary.com/diljekoto/image/upload/v1789123844/alaory-pyORBYowYgc-unsplash_z9kzff_537c8f.webp"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* OTP Expiration Limit Notice */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border">
                    <Clock className="size-3.5 text-primary shrink-0" />
                    <span>
                        {t.rich('validFor', {
                            strong: (chunks) => <strong>{chunks}</strong>
                        })}
                    </span>
                </div>

                {/* OTP Input Field */}
                <div className="space-y-2 flex flex-col items-center">
                    <Label htmlFor="code" className="text-sm font-medium">
                        {t('verificationCode')}
                    </Label>
                    <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                            <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                                <div className={cn('flex items-center gap-2 p-1.5 rounded-lg transition-colors', errors.code && 'ring-2 ring-destructive ring-offset-2 ring-offset-background')}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} className={cn(errors.code && 'border-destructive text-destructive')} />
                                        <InputOTPSlot index={1} className={cn(errors.code && 'border-destructive text-destructive')} />
                                        <InputOTPSlot index={2} className={cn(errors.code && 'border-destructive text-destructive')} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} className={cn(errors.code && 'border-destructive text-destructive')} />
                                        <InputOTPSlot index={4} className={cn(errors.code && 'border-destructive text-destructive')} />
                                        <InputOTPSlot index={5} className={cn(errors.code && 'border-destructive text-destructive')} />
                                    </InputOTPGroup>
                                </div>
                            </InputOTP>
                        )}
                    />
                    {errors.code && (
                        <div className="flex items-center gap-1 text-xs text-destructive mt-1 font-medium">
                            <AlertCircle className="size-3.5" />
                            <span>{errors.code.message}</span>
                        </div>
                    )}
                </div>

                {/* Submit Action */}
                <div className="space-y-3">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t('verifying') : t('verifyCode')}
                    </Button>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <span>{t('resendPrompt')}</span>
                        <button type="button" onClick={handleResendCode} disabled={isResending} className="text-primary font-medium hover:underline disabled:opacity-50">
                            {isResending ? t('resending') : t('resendAction')}
                        </button>
                    </div>
                </div>

                {/* Navigation Link */}
                <p className="text-center text-xs text-muted-foreground pt-2">
                    {t('backToSignIn')}{' '}
                    <Link href="/sign-in" className="text-primary font-medium hover:underline">
                        {t('signIn')}
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}

export function EmailVerificationForm() {
    const t = useTranslations('Auth.EmailVerification');
    return (
        <Suspense fallback={<div className="text-center text-sm text-muted-foreground p-8">{t('loadingPage')}</div>}>
            <EmailVerificationFormContent />
        </Suspense>
    );
}
