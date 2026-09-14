import { getCookie } from '@/lib/server-utils';
import { ApiException, CloudinaryErrorResponse, CloudinaryUploadResponse, ExceptionResponse, SuccessResponse } from '../types';
import { env } from '@/lib/env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;
const COOKIE_NAME = env.NEXT_PUBLIC_SESSION_COOKIE_NAME;

/**
 * Service object containing methods for handling image uploads to Cloudinary.
 */
export const uploadersService = {
    /**
     * Generates a signature for secure image uploading to Cloudinary.
     * 
     * @param {Object} params - The parameters object.
     * @param {string} params.query - The query string to pass to the signature generation endpoint.
     * @returns {Promise<{timestamp: number, signature: string, cloudName: string, apiKey: string, folder: string | null}>} The signature and necessary Cloudinary credentials.
     * @throws {ApiException} If the API request fails or the user is unauthorized.
     */
    async generateImageSignature({ query }: { query: string }) {
        const cookie = await getCookie({ cookieName: COOKIE_NAME });
        if (cookie === null) throw new ApiException('Cookie not found', 401, {});

        try {
            const response = await fetch(`${API_BASE_URL}/uploaders/generate-sign-url?${query}`, {
                method: 'GET',
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
                    message: response.statusText || 'Generate Sign-Url Failed',
                    errors: {}
                }));
                throw new ApiException(data.message || 'Generate Sign-Url Failed', data.statusCode || response.status, data.errors || {});
            }

            const data: SuccessResponse<{
                timestamp: number;
                signature: string;
                cloudName: string;
                apiKey: string;
                folder: string | null;
            }> = await response.json();
            return data.data;
        } catch (exception) {
            if (exception instanceof ApiException) throw exception;
            throw exception;
        }
    },

    /**
     * Securely uploads a single image file to Cloudinary.
     * 
     * @param {Object} params - The parameters object.
     * @param {File} params.file - The image file to upload.
     * @param {string} [params.query='folder=/responku/users-assets/profiles'] - The folder path query for Cloudinary.
     * @returns {Promise<CloudinaryUploadResponse>} The result of the Cloudinary upload.
     * @throws {ApiException} If the file size exceeds the limit, the signature generation fails, or the Cloudinary upload fails.
     */
    async secureUploadSingleImage({ file, query = 'folder=/responku/users-assets/profiles' }: { file: File; query: string }) {
        try {
            if (file.size > parseInt(env.NEXT_PUBLIC_CLOUDINARY_MAX_FILE_UPLOAD)) throw new ApiException('Image size exceeded, Max upload: 10Mb', 400, {});
            const signature = await this.generateImageSignature({ query });
            const formdata = new FormData();

            formdata.append('file', file);
            formdata.append('api_key', signature.apiKey);
            formdata.append('timestamp', signature.timestamp.toString());
            formdata.append('folder', signature.folder ?? 'responku');
            formdata.append('signature', signature.signature);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
                method: 'POST',
                body: formdata
            });

            if (!response.ok) {
                const data: CloudinaryErrorResponse = await response.json();
                throw new ApiException(data.error.message, response.status, {});
            }

            const data: CloudinaryUploadResponse = await response.json();
            return data;
        } catch (exception) {
            if (exception instanceof ApiException) throw exception;
            throw exception;
        }
    }
};
