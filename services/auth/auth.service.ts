import { ApiException, ExceptionResponse, SuccessResponse } from '../types';
import { env } from '@/lib/env';
import { getCookie } from '@/lib/utils';
import { SignUpPayload, SignUpResponse, SignInPayload, SignInResponse, GetUserResponse, ConfirmVerificationPayload, ConfirmVerificationResponse, ResendVerificationPayload, ResendVerificationResponse, SignOutResponse } from '@/types/auth';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;
const COOKIE_NAME = env.NEXT_PUBLIC_SESSION_COOKIE_NAME;

/**
 * Service object containing methods for handling authentication-related API requests.
 */
export const authService = {
    /**
     * Registers a new user.
     * 
     * @param {SignUpPayload} payload - The user registration data.
     * @returns {Promise<SignUpResponse['data']>} The registration result data.
     * @throws {ApiException} If the API request fails.
     */
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
            if (exception instanceof ApiException) throw exception;
            throw exception;
        }
    },

    /**
     * Authenticates a user and establishes a session.
     * 
     * @param {SignInPayload} payload - The login credentials.
     * @returns {Promise<SignInResponse['data']>} The login result data.
     * @throws {ApiException} If the API request fails.
     */
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
            if (exception instanceof ApiException) throw exception;
            throw exception;
        }
    },

    /**
     * Retrieves the currently authenticated user's profile.
     * Requires a valid session cookie.
     * 
     * @returns {Promise<GetUserResponse['data']>} The user profile data.
     * @throws {ApiException} If the API request fails or cookie is missing.
     */
    async getMe(): Promise<GetUserResponse['data']> {
        try {
            const cookie = await getCookie({ cookieName: COOKIE_NAME });
            if (cookie === null) throw new ApiException('Cookie not found', 401, {});

            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `${COOKIE_NAME}=${cookie}`
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
            if (exception instanceof ApiException) throw exception;
            throw exception;
        }
    },

    /**
     * Confirms user account verification using an OTP or verification code.
     * 
     * @param {ConfirmVerificationPayload} payload - The verification payload containing the code.
     * @returns {Promise<ConfirmVerificationResponse['data']>} The verification result data.
     * @throws {ApiException} If the API request fails or the code is invalid/expired.
     */
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
            if (exception instanceof ApiException) throw exception;
            throw exception;
        }
    },

    /**
     * Requests a new verification code to be sent to the user.
     * 
     * @param {ResendVerificationPayload} payload - The payload containing identifying information (like email).
     * @returns {Promise<ResendVerificationResponse['data']>} The result data from resending the verification code.
     * @throws {ApiException} If the API request fails.
     */
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
            if (exception instanceof ApiException) throw exception;
            throw exception;
        }
    },

    /**
     * Signs out the current user, invalidating their session on the server.
     * Requires a valid session cookie.
     * 
     * @returns {Promise<SignOutResponse>} A message confirming sign out.
     * @throws {ApiException} If the API request fails or cookie is missing.
     */
    async signOut(): Promise<SignOutResponse> {
        try {
            const cookie = await getCookie({ cookieName: COOKIE_NAME });
            if (cookie === null) throw new ApiException('Cookie not found', 401, {});

            const response = await fetch(`${API_BASE_URL}/auth/sign-out`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `${COOKIE_NAME}=${cookie}`
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
            if (exception instanceof ApiException) throw exception;
            throw exception;
        }
    }
};
