import { ApiException, ExceptionResponse, SuccessResponse } from '../types';
import { getCookie } from '@/lib/utils';
import { SignUpPayload, SignUpResponse, SignInPayload, SignInResponse, GetUserResponse, ConfirmVerificationPayload, ConfirmVerificationResponse, ResendVerificationPayload, ResendVerificationResponse, SignOutResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const authService = {
    // 1. SIGN UP
    async signUp(payload: SignUpPayload): Promise<SignUpResponse['data']> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                const data: ExceptionResponse = await response.json().catch(() => ({
                    ok: false,
                    statusCode: response.status,
                    message: response.statusText || 'Sign up failed',
                    errors: {}
                }));
                throw new ApiException(data.message || 'Sign up failed', data.statusCode || response.status, data.errors || {});
            }

            const data: SuccessResponse<SignUpResponse['data']> = await response.json();
            return data.data;
        } catch (exception) {
            if (exception instanceof ApiException) {
                throw exception;
            }
            throw exception;
        }
    },

    // 2. SIGN IN
    async signIn(payload: SignInPayload): Promise<SignInResponse['data']> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                const data: ExceptionResponse = await response.json().catch(() => ({
                    ok: false,
                    statusCode: response.status,
                    message: response.statusText || 'Sign in failed',
                    errors: {}
                }));
                throw new ApiException(data.message || 'Sign in failed', data.statusCode || response.status, data.errors || {});
            }

            const data: SuccessResponse<SignInResponse['data']> = await response.json();
            return data.data;
        } catch (exception) {
            if (exception instanceof ApiException) {
                throw exception;
            }
            throw exception;
        }
    },

    // 3. GET CURRENT USER (ME)
    async getMe(): Promise<GetUserResponse['data']> {
        try {
            const cookieName = 'nestsession';
            const cookie = await getCookie({ cookieName });
            if (cookie === null) throw new ApiException('Cookie not found', 401, {});

            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `${cookieName}=${cookie}`
                },
                credentials: 'include',
                cache: 'no-store'
            });

            if (!response.ok) {
                const data: ExceptionResponse = await response.json().catch(() => ({
                    ok: false,
                    statusCode: response.status,
                    message: response.statusText || 'Unauthorized',
                    errors: {}
                }));
                throw new ApiException(data.message || 'Unauthorized', data.statusCode || response.status, data.errors || {});
            }

            const data: SuccessResponse<GetUserResponse['data']> = await response.json();
            return data.data;
        } catch (exception) {
            if (exception instanceof ApiException) {
                throw exception;
            }
            throw exception;
        }
    },

    // 4. CONFIRM OTP VERIFICATION
    async confirmVerification(payload: ConfirmVerificationPayload): Promise<ConfirmVerificationResponse['data']> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/confirm-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                const data: ExceptionResponse = await response.json().catch(() => ({
                    ok: false,
                    statusCode: response.status,
                    message: response.statusText || 'Verification failed',
                    errors: {}
                }));
                throw new ApiException(data.message || 'Invalid or expired OTP', data.statusCode || response.status, data.errors || {});
            }

            const data: SuccessResponse<ConfirmVerificationResponse['data']> = await response.json();
            return data.data;
        } catch (exception) {
            if (exception instanceof ApiException) {
                throw exception;
            }
            throw exception;
        }
    },

    // 5. RESEND OTP VERIFICATION
    async resendVerification(payload: ResendVerificationPayload): Promise<ResendVerificationResponse['data']> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                const data: ExceptionResponse = await response.json().catch(() => ({
                    ok: false,
                    statusCode: response.status,
                    message: response.statusText || 'Failed to resend verification code',
                    errors: {}
                }));
                throw new ApiException(data.message || 'Failed to resend code', data.statusCode || response.status, data.errors || {});
            }

            const data: SuccessResponse<ResendVerificationResponse['data']> = await response.json();
            return data.data;
        } catch (exception) {
            if (exception instanceof ApiException) {
                throw exception;
            }
            throw exception;
        }
    },

    // 6. SIGN OUT
    async signOut(): Promise<SignOutResponse> {
        try {
            const cookieName = 'nestsession';
            const cookie = await getCookie({ cookieName });
            if (cookie === null) throw new ApiException('Cookie not found', 401, {});

            const response = await fetch(`${API_BASE_URL}/auth/sign-out`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `${cookieName}=${cookie}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const data: ExceptionResponse = await response.json().catch(() => ({
                    ok: false,
                    statusCode: response.status,
                    message: response.statusText || 'Sign out failed',
                    errors: {}
                }));
                throw new ApiException(data.message || 'Sign out failed', data.statusCode || response.status, data.errors || {});
            }

            const data: SuccessResponse<Record<string, unknown>> = await response.json().catch(() => ({
                ok: true,
                statusCode: 200,
                message: 'Signed out successfully',
                data: {},
                meta: {}
            }));

            return {
                message: data.message || 'Signed out successfully'
            };
        } catch (exception) {
            if (exception instanceof ApiException) {
                throw exception;
            }
            throw exception;
        }
    }
};
