'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Clock, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth/auth.service';
import { ApiException } from '@/services/types';
import { AuthCard } from './auth-card';
import { cn } from '@/lib/utils';

const otpSchema = z.object({
    code: z.string().min(6, { message: 'Verification code must be 6 digits' }).max(6, { message: 'Verification code must be 6 digits' })
});

type OTPValues = z.infer<typeof otpSchema>;

function EmailVerificationFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

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
            toast.error('Email address is missing. Please sign up or sign in again.');
            return;
        }

        setIsLoading(true);
        try {
            await authService.confirmVerification({
                email,
                otp: data.code
            });
            toast.success('Email Verified');
            router.push('/login');
        } catch (exception) {
            setError('code', {
                type: 'manual',
                message: 'Invalid or expired OTP'
            });
            if (exception instanceof ApiException) {
                toast.error(exception.message || 'Invalid or expired OTP');
            } else {
                toast.error('Invalid or expired OTP');
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResendCode() {
        if (!email) {
            toast.error('Email address is missing. Please return to sign in.');
            return;
        }

        setIsResending(true);
        try {
            await authService.resendVerification({ email });
            toast.success('New OTP sent to your email');
        } catch (exception) {
            if (exception instanceof ApiException) {
                toast.error(exception.message || 'Failed to resend code');
            } else {
                toast.error('Failed to resend code');
            }
        } finally {
            setIsResending(false);
        }
    }

    return (
        <AuthCard
            title="Verify your email"
            description={email ? `We have sent a 6-digit verification code to ${email}.` : 'Enter the 6-digit verification code sent to your email address.'}
            imageSrc="https://res.cloudinary.com/diljekoto/image/upload/v1789123844/alaory-pyORBYowYgc-unsplash_z9kzff_537c8f.webp"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* OTP Expiration Limit Notice */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border">
                    <Clock className="size-3.5 text-primary shrink-0" />
                    <span>
                        The verification code is valid for <strong>15 minutes</strong>.
                    </span>
                </div>

                {/* OTP Input Field */}
                <div className="space-y-2 flex flex-col items-center">
                    <Label htmlFor="code" className="text-sm font-medium">
                        Verification Code
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
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </Button>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <span>Didn&apos;t receive the code?</span>
                        <button type="button" onClick={handleResendCode} disabled={isResending} className="text-primary font-medium hover:underline disabled:opacity-50">
                            {isResending ? 'Resending...' : 'Resend Code'}
                        </button>
                    </div>
                </div>

                {/* Navigation Link */}
                <p className="text-center text-xs text-muted-foreground pt-2">
                    Back to{' '}
                    <Link href="/sign-in" className="text-primary font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}

export function EmailVerificationForm() {
    return (
        <Suspense fallback={<div className="text-center text-sm text-muted-foreground p-8">Loading verification page...</div>}>
            <EmailVerificationFormContent />
        </Suspense>
    );
}
