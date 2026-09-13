'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth/auth.service';
import { ApiException } from '@/services/types';
import { AuthCard } from './auth-card';

const signUpSchema = z
    .object({
        fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
        email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
        terms: z.boolean().refine(val => val === true, {
            message: 'You must accept the terms to proceed'
        })
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
            toast.success('Account created');
            router.push(`/email-verification?email=${encodeURIComponent(params.email)}`);
        } catch (exception) {
            if (exception instanceof ApiException) {
                toast.error(exception.message || 'Registration failed');
            } else {
                toast.error('Registration failed');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard title="Create an account" description="Enter your information to get started." imageSrc="https://res.cloudinary.com/diljekoto/image/upload/v1789123849/nour-betar-BFazlw6s0N8-unsplash_nhd6pf_51140e.webp">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                    </Label>
                    <Input id="fullName" type="text" placeholder="John Doe" aria-invalid={!!errors.fullName} {...register('fullName')} />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email
                    </Label>
                    <Input id="email" type="email" placeholder="your@email.com" aria-invalid={!!errors.email} {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pr-10" aria-invalid={!!errors.password} {...register('password')} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="pr-10" aria-invalid={!!errors.confirmPassword} {...register('confirmPassword')} />
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
                            I agree to the Terms of Service and Privacy Policy
                        </Label>
                    </div>
                    {errors.terms && <p className="text-xs text-destructive mt-1">{errors.terms.message}</p>}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create account'}
                </Button>

                {/* Social Login */}
                <div className="grid grid-cols-1 gap-3">
                    <Button type="button" variant="outline" onClick={() => toast.info('Google login initiated')} className="w-full text-xs font-medium">
                        Google
                    </Button>
                </div>

                {/* Link */}
                <p className="text-center text-xs text-muted-foreground pt-3">
                    Already have an account?{' '}
                    <Link href="/sign-in" className="text-primary font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
}
