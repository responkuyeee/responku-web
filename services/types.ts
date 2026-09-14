/**
 * Represents an error returned by the API.
 * Contains the HTTP status code and any specific error details.
 */
export class ApiException extends Error {
    statusCode: number;
    errors: Record<string, unknown>;

    constructor(message: string, statusCode: number, errors: Record<string, unknown> = {}) {
        super(message);

        this.name = 'ApiException';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

/**
 * Standard shape for a successful API response.
 * @template T - The type of the `data` payload.
 */
export type SuccessResponse<T = Record<string, unknown>> = {
    ok: true;
    statusCode: number;
    message: string;
    data: T;
    meta: Record<string, unknown>;
};

/**
 * Standard shape for a failed API response.
 * @template T - The type of the `errors` object.
 */
export type ExceptionResponse<T = Record<string, unknown>> = {
    ok: false;
    statusCode: number;
    message: string;
    errors: T;
};

/**
 * Response shape for a successful Cloudinary image upload.
 */
export type CloudinaryUploadResponse = {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    asset_folder: string;
    display_name: string;
    original_filename: string;
    api_key: string;
};

/**
 * Response shape for a failed Cloudinary upload or operation.
 */
export type CloudinaryErrorResponse = {
    error: {
        message: string;
    };
};
